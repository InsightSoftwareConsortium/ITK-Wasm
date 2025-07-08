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

test.describe("write-transform", () => {
  test("Writes an transform in the demo", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/LinearTransform.iwt.cbor");

    // Navigate to writeTransform tab
    await page.click('sl-tab[panel="writeTransform-panel"]');

    // Upload file
    await page.setInputFiles(
      '#writeTransformInputs input[name="transform-file"]',
      {
        name: "LinearTransform.iwt.cbor",
        mimeType: "application/octet-stream",
        buffer: testFile,
      }
    );

    // Wait for transform details to appear
    await expect(page.locator("#writeTransform-transform-details")).toContainText(
      "transformType"
    );

    // Set output filename
    await page.fill(
      '#writeTransformInputs sl-input[name="serialized-transform"] input',
      "LinearTransform.h5"
    );

    // Run the pipeline
    await page.click('#writeTransformInputs sl-button[name="run"]');

    // Wait for results
    await expect(
      page.locator("#writeTransform-serialized-transform-details")
    ).toContainText("137,72");
  });

  test("Writes an transform to an ArrayBuffer", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/LinearTransform.iwt.cbor");

    const result = await page.evaluate(async (fileBuffer) => {
      const arrayBuffer = new Uint8Array(fileBuffer).buffer;
      const { transform, webWorker } = await window.transformIo.readTransform({
        data: new Uint8Array(arrayBuffer),
        path: "LinearTransform.iwt.cbor",
      });
      const { serializedTransform } = await window.transformIo.writeTransform(
        transform,
        "LinearTransform.h5",
        {
          webWorker,
        }
      );
      const { transform: transformBack } = await window.transformIo.readTransform(
        serializedTransform,
        {
          webWorker,
        }
      );
      webWorker.terminate();
      return transformBack;
    }, Array.from(testFile));

    verifyTestLinearTransform(result);
  });
});