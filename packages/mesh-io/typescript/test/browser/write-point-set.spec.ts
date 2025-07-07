import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import { FloatTypes, PixelTypes } from "itk-wasm";

function verifyPointSet(pointSet: any) {
  expect(pointSet.pointSetType.dimension).toBe(3);
  expect(pointSet.pointSetType.pointComponentType).toBe(FloatTypes.Float32);
  expect(pointSet.pointSetType.pointPixelType).toBe(PixelTypes.Vector);
  expect(pointSet.numberOfPoints).toBe(8);
}

test.describe("write-point-set", () => {
  test("Writes an point set in the demo", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/baseline/obj-read-point-set-test.iwm.cbor");

    // Navigate to writePointSet tab
    await page.click('sl-tab[panel="writePointSet-panel"]');

    // Upload file
    await page.setInputFiles(
      '#writePointSetInputs input[name="point-set-file"]',
      {
        name: "obj-read-point-set-test.iwm.cbor",
        mimeType: "application/octet-stream",
        buffer: testFile,
      }
    );

    // Wait for point set details to appear
    await expect(page.locator("#writePointSet-point-set-details")).toContainText(
      "pointSetType"
    );

    // Set output filename
    await page.fill(
      '#writePointSetInputs sl-input[name="serialized-point-set"] input',
      "point-set.vtk"
    );

    // Run the pipeline
    await page.click('#writePointSetInputs sl-button[name="run"]');

    // Wait for results
    await expect(
      page.locator("#writePointSet-serialized-point-set-details")
    ).toContainText("35,32");
  });

  test("Writes an point set to an ArrayBuffer", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/baseline/obj-read-point-set-test.iwm.cbor");

    const result = await page.evaluate(async (fileBuffer) => {
      const arrayBuffer = new Uint8Array(fileBuffer).buffer;
      const { pointSet, webWorker } = await window.meshIo.readPointSet({
        data: new Uint8Array(arrayBuffer),
        path: "obj-read-point-set-test.iwm.cbor",
      });
      const { serializedPointSet } = await window.meshIo.writePointSet(
        pointSet,
        "point-set.iwm.cbor",
        {
          webWorker,
        }
      );
      const { pointSet: pointSetBack } = await window.meshIo.readPointSet(
        serializedPointSet,
        {
          webWorker,
        }
      );
      webWorker.terminate();
      return pointSetBack;
    }, Array.from(testFile));

    verifyPointSet(result);
  });
});