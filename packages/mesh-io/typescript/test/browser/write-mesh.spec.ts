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

test.describe("write-mesh", () => {
  test("Writes an mesh in the demo", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/cow.iwm.cbor");

    // Navigate to writeMesh tab
    await page.click('sl-tab[panel="writeMesh-panel"]');

    // Upload file
    await page.setInputFiles(
      '#writeMeshInputs input[name="mesh-file"]',
      {
        name: "cow.iwm.cbor",
        mimeType: "application/octet-stream",
        buffer: testFile,
      }
    );

    // Wait for mesh details to appear
    await expect(page.locator("#writeMesh-mesh-details")).toContainText(
      "meshType"
    );

    // Set output filename
    await page.fill(
      '#writeMeshInputs sl-input[name="serialized-mesh"] input',
      "cow.vtk"
    );

    // Run the pipeline
    await page.click('#writeMeshInputs sl-button[name="run"]');

    // Wait for results
    await expect(
      page.locator("#writeMesh-serialized-mesh-details")
    ).toContainText("35,32");
  });

  test("Writes an mesh to an ArrayBuffer", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/cow.iwm.cbor");

    const result = await page.evaluate(async (fileBuffer) => {
      const arrayBuffer = new Uint8Array(fileBuffer).buffer;
      const { mesh, webWorker } = await window.meshIo.readMesh({
        data: new Uint8Array(arrayBuffer),
        path: "cow.iwm.cbor",
      });
      const { serializedMesh } = await window.meshIo.writeMesh(
        mesh,
        "cow.vtk",
        {
          webWorker,
        }
      );
      const { mesh: meshBack } = await window.meshIo.readMesh(serializedMesh, {
        webWorker,
      });
      webWorker.terminate();
      return meshBack;
    }, Array.from(testFile));

    verifyMesh(result);
  });
});