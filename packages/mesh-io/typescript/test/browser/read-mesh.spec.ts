import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import { IntTypes, FloatTypes, PixelTypes } from "itk-wasm";

function verifyMesh(mesh: any) {
  expect(mesh.meshType.dimension).toBe(3);
  expect(mesh.meshType.pointComponentType).toBe(FloatTypes.Float32);
  expect(mesh.meshType.cellComponentType).toBe(IntTypes.UInt32);
  expect(mesh.meshType.pointPixelType).toBe(PixelTypes.Scalar);
  expect(mesh.meshType.cellPixelType).toBe(PixelTypes.Scalar);
  expect(mesh.numberOfPoints).toBe(2903);
  expect(mesh.numberOfCells).toBe(3263);
}

test.describe("read-mesh", () => {
  test("Reads an mesh File in the demo", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/cow.vtk");

    // Navigate to readMesh tab
    await page.click('sl-tab[panel="readMesh-panel"]');

    // Upload file
    await page.setInputFiles(
      '#readMeshInputs input[name="serialized-mesh-file"]',
      {
        name: "cow.vtk",
        mimeType: "application/octet-stream",
        buffer: testFile,
      }
    );

    // Wait for input details to appear
    await expect(
      page.locator("#readMesh-serialized-mesh-details")
    ).toContainText("35,32");

    // Run the pipeline
    await page.click('#readMeshInputs sl-button[name="run"]');

    // Wait for results
    await expect(page.locator("#readMesh-mesh-details")).toContainText(
      "meshType"
    );
  });

  test("Reads an mesh BinaryFile", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/cow.vtk");

    const result = await page.evaluate(async (fileBuffer) => {
      const arrayBuffer = new Uint8Array(fileBuffer).buffer;
      const { mesh, webWorker } = await window.meshIo.readMesh({
        data: new Uint8Array(arrayBuffer),
        path: "cow.vtk",
      });
      webWorker.terminate();
      return mesh;
    }, Array.from(testFile));

    verifyMesh(result);
  });

  test("Reads an mesh File", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/cow.vtk");

    const result = await page.evaluate(async (fileBuffer) => {
      const arrayBuffer = new Uint8Array(fileBuffer).buffer;
      const cowFile = new window.File([arrayBuffer], "cow.vtk");
      const { mesh, webWorker } = await window.meshIo.readMesh(cowFile);
      webWorker.terminate();
      return mesh;
    }, Array.from(testFile));

    verifyMesh(result);
  });

  test("Reads re-uses a WebWorker", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/cow.vtk");

    const result = await page.evaluate(async (fileBuffer) => {
      const arrayBuffer = new Uint8Array(fileBuffer).buffer;
      const cowFile = new window.File([arrayBuffer], "cow.vtk");
      const { webWorker } = await window.meshIo.readMesh(cowFile);
      const { mesh } = await window.meshIo.readMesh(cowFile, { webWorker });
      webWorker.terminate();
      return mesh;
    }, Array.from(testFile));

    verifyMesh(result);
  });

  test("Throws a catchable error for an invalid file", async ({ page }) => {
    await page.goto("/");

    const errorMessage = await page.evaluate(async () => {
      const invalidArray = new Uint8Array([21, 4, 4, 4, 4, 9, 5, 0, 82, 42]);
      const invalidBlob = new window.Blob([invalidArray]);
      const invalidFile = new window.File([invalidBlob], "invalid.file");
      try {
        const { webWorker, mesh } = await window.meshIo.readMesh(invalidFile);
        webWorker.terminate();
        return null;
      } catch (error: any) {
        return error.message;
      }
    });

    expect(errorMessage).toBe("Could not find IO for: invalid.file");
  });
});