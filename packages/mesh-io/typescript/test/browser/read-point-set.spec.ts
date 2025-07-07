import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import { FloatTypes, PixelTypes } from "itk-wasm";

function verifyPointSet(pointSet: any) {
  expect(pointSet.pointSetType.dimension).toBe(3);
  expect(pointSet.pointSetType.pointComponentType).toBe(FloatTypes.Float32);
  expect(pointSet.pointSetType.pointPixelType).toBe(PixelTypes.Vector);
  expect(pointSet.numberOfPoints).toBe(8);
}

test.describe("read-point-set", () => {
  test("Reads an point set File in the demo", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/box-points.obj");

    // Navigate to readPointSet tab
    await page.click('sl-tab[panel="readPointSet-panel"]');

    // Upload file
    await page.setInputFiles(
      '#readPointSetInputs input[name="serialized-point-set-file"]',
      {
        name: "box-points.obj",
        mimeType: "application/octet-stream",
        buffer: testFile,
      }
    );

    // Wait for input details to appear
    await expect(
      page.locator("#readPointSet-serialized-point-set-details")
    ).toContainText("35,9");

    // Run the pipeline
    await page.click('#readPointSetInputs sl-button[name="run"]');

    // Wait for results
    await expect(page.locator("#readPointSet-point-set-details")).toContainText(
      "pointSetType"
    );
  });

  test("Reads an pointSet BinaryFile", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/box-points.obj");

    const result = await page.evaluate(async (fileBuffer) => {
      const arrayBuffer = new Uint8Array(fileBuffer).buffer;
      const { pointSet, webWorker } = await window.meshIo.readPointSet({
        data: new Uint8Array(arrayBuffer),
        path: "box-points.obj",
      });
      webWorker.terminate();
      return pointSet;
    }, Array.from(testFile));

    verifyPointSet(result);
  });

  test("Reads an pointSet File", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/box-points.obj");

    const result = await page.evaluate(async (fileBuffer) => {
      const arrayBuffer = new Uint8Array(fileBuffer).buffer;
      const cowFile = new window.File([arrayBuffer], "box-points.obj");
      const { pointSet, webWorker } = await window.meshIo.readPointSet(cowFile);
      webWorker.terminate();
      return pointSet;
    }, Array.from(testFile));

    verifyPointSet(result);
  });

  test("Reads re-uses a WebWorker", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/box-points.obj");

    const result = await page.evaluate(async (fileBuffer) => {
      const arrayBuffer = new Uint8Array(fileBuffer).buffer;
      const cowFile = new window.File([arrayBuffer], "box-points.obj");
      const { webWorker } = await window.meshIo.readPointSet(cowFile);
      const { pointSet } = await window.meshIo.readPointSet(cowFile, {
        webWorker,
      });
      webWorker.terminate();
      return pointSet;
    }, Array.from(testFile));

    verifyPointSet(result);
  });

  test("Throws a catchable error for an invalid file", async ({ page }) => {
    await page.goto("/");

    const errorMessage = await page.evaluate(async () => {
      const invalidArray = new Uint8Array([21, 4, 4, 4, 4, 9, 5, 0, 82, 42]);
      const invalidBlob = new window.Blob([invalidArray]);
      const invalidFile = new window.File([invalidBlob], "invalid.file");
      try {
        const { webWorker, pointSet } =
          await window.meshIo.readPointSet(invalidFile);
        webWorker.terminate();
        return null;
      } catch (error: any) {
        return error.message;
      }
    });

    expect(errorMessage).toBe("Could not find IO for: invalid.file");
  });
});