import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test("downsampleBinShrink", async ({ page }) => {
  await page.goto("/");

  const testFile = readFileSync("../test/data/input/cthead1.png");

  // Navigate to downsampleBinShrink tab
  await page.click('sl-tab[panel="downsampleBinShrink-panel"]');

  // Upload file
  await page.setInputFiles(
    '#downsampleBinShrinkInputs input[name="input-file"]',
    {
      name: "cthead1.png",
      mimeType: "image/png",
      buffer: testFile,
    }
  );

  // Wait for input details to appear
  await expect(
    page.locator("#downsampleBinShrink-input-details")
  ).toContainText("imageType");

  // Set shrink factors
  const shrinkFactorsInput = page.locator(
    '#downsampleBinShrinkInputs sl-input[name="shrink-factors"] input'
  );
  await shrinkFactorsInput.clear();
  await shrinkFactorsInput.fill("[2, 2]");

  // Run the pipeline
  await page.click('#downsampleBinShrinkInputs sl-button[name="run"]');

  // Wait for results
  await expect(
    page.locator("#downsampleBinShrink-downsampled-details")
  ).toContainText("imageType");
});
