import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test("resampleToReference", async ({ page }) => {
  await page.goto("/");

  const testFile = readFileSync("../test/data/input/cthead1.png");

  // Navigate to resample tab
  await page.click('sl-tab[panel="resampleToReference-panel"]');

  // Upload the moving image
  await page.setInputFiles('#resampleToReferenceInputs input[name="input-file"]', {
    name: "cthead1.png",
    mimeType: "image/png",
    buffer: testFile,
  });

  // Wait for moving-image details to appear
  await expect(page.locator("#resampleToReference-input-details")).toContainText(
    "imageType"
  );

  // Upload the reference image (reuse cthead1 so the output grid matches the
  // moving image -- an identity resample that is self-contained from a single
  // input, mirroring the sample-inputs loader).
  await page.setInputFiles(
    '#resampleToReferenceInputs input[name="reference-image-file"]',
    {
      name: "cthead1.png",
      mimeType: "image/png",
      buffer: testFile,
    }
  );

  // Wait for reference-image details to appear
  await expect(
    page.locator("#resampleToReference-reference-image-details")
  ).toContainText("imageType");

  // Select the interpolator
  const interpolatorInput = page.locator(
    '#resampleToReferenceInputs sl-input[name="interpolator"] input'
  );
  await interpolatorInput.clear();
  await interpolatorInput.fill("linear");

  // Run the pipeline
  await page.click('#resampleToReferenceInputs sl-button[name="run"]');

  // Wait for results
  await expect(page.locator("#resampleToReference-output-details")).toContainText(
    "imageType"
  );
});
