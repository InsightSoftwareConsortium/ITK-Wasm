import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

function verifyTestLinearTransform(transformList: any) {
  expect(transformList.length).toBe(1);
  const transform = transformList[0];
  expect(transform.transformType.transformParameterization).toBe("Affine");
  expect(transform.transformType.parametersValueType).toBe("float64");
  expect(transform.transformType.inputDimension).toBe(3);
  expect(transform.transformType.outputDimension).toBe(3);
  expect(transform.numberOfParameters).toBe(12);
  expect(transform.numberOfFixedParameters).toBe(3);
  expect(transform.fixedParameters).toEqual(new Float64Array([0, 0, 0]));
  expect(transform.parameters).toEqual(
    new Float64Array([
      0.65631490118447, 0.5806583745824385, -0.4817536741017158,
      -0.7407986817430222, 0.37486398378429736, -0.5573995934598175,
      -0.14306664045479867, 0.7227121458012518, 0.676179776908723,
      -65.99999999999997, 69.00000000000004, 32.000000000000036,
    ])
  );
}

test.describe("read-transform", () => {
  test("Reads an transform File in the demo", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/LinearTransform.h5");

    // Navigate to readTransform tab
    await page.click('sl-tab[panel="readTransform-panel"]');

    // Upload file
    await page.setInputFiles(
      '#readTransformInputs input[name="serialized-transform-file"]',
      {
        name: "LinearTransform.h5",
        mimeType: "application/octet-stream",
        buffer: testFile,
      }
    );

    // Wait for input details to appear
    await expect(
      page.locator("#readTransform-serialized-transform-details")
    ).toContainText("137,72");

    // Run the pipeline
    await page.click('#readTransformInputs sl-button[name="run"]');

    // Wait for results
    await expect(page.locator("#readTransform-transform-details")).toContainText(
      "transformType"
    );
  });

  test("Reads an transform BinaryFile", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/LinearTransform.h5");

    const result = await page.evaluate(async (fileBuffer) => {
      const arrayBuffer = new Uint8Array(fileBuffer).buffer;
      const { transform, webWorker } = await window.transformIo.readTransform({
        data: new Uint8Array(arrayBuffer),
        path: "LinearTransform.h5",
      });
      webWorker.terminate();
      return transform;
    }, Array.from(testFile));

    verifyTestLinearTransform(result);
  });

  test("Reads an transform File", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/LinearTransform.h5");

    const result = await page.evaluate(async (fileBuffer) => {
      const arrayBuffer = new Uint8Array(fileBuffer).buffer;
      const transformFile = new window.File([arrayBuffer], "LinearTransform.h5");
      const { transform, webWorker } = await window.transformIo.readTransform(
        transformFile
      );
      webWorker.terminate();
      return transform;
    }, Array.from(testFile));

    verifyTestLinearTransform(result);
  });

  test("Reads re-uses a WebWorker", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/LinearTransform.h5");

    const result = await page.evaluate(async (fileBuffer) => {
      const arrayBuffer = new Uint8Array(fileBuffer).buffer;
      const transformFile = new window.File([arrayBuffer], "LinearTransform.h5");
      const { webWorker } = await window.transformIo.readTransform(transformFile);
      const { transform } = await window.transformIo.readTransform(transformFile, {
        webWorker,
      });
      webWorker.terminate();
      return transform;
    }, Array.from(testFile));

    verifyTestLinearTransform(result);
  });

  test("Throws a catchable error for an invalid file", async ({ page }) => {
    await page.goto("/");

    const errorMessage = await page.evaluate(async () => {
      const invalidArray = new Uint8Array([21, 4, 4, 4, 4, 9, 5, 0, 82, 42]);
      const invalidBlob = new window.Blob([invalidArray]);
      const invalidFile = new window.File([invalidBlob], "invalid.file");
      try {
        const { webWorker, transform } = await window.transformIo.readTransform(
          invalidFile
        );
        webWorker.terminate();
        return null;
      } catch (error: any) {
        return error.message;
      }
    });

    expect(errorMessage).toBe("Could not find IO for: invalid.file");
  });
});