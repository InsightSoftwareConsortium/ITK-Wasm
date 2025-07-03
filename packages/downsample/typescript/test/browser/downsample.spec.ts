import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test("downsample", async ({ page }) => {
  await page.goto("/");

  const testFile = readFileSync("../test/data/input/cthead1.png");

  // Navigate to downsample tab
  await page.click('sl-tab[panel="downsample-panel"]');

  // Upload file
  await page.setInputFiles('#downsampleInputs input[name="input-file"]', {
    name: "cthead1.png",
    mimeType: "image/png",
    buffer: testFile,
  });

  // Wait for input details to appear
  await expect(page.locator("#downsample-input-details")).toContainText(
    "imageType"
  );

  // Set shrink factors
  const shrinkFactorsInput = page.locator(
    '#downsampleInputs sl-input[name="shrink-factors"] input'
  );
  await shrinkFactorsInput.clear();
  await shrinkFactorsInput.fill("[2, 2]");

  // Run the pipeline
  await page.click('#downsampleInputs sl-button[name="run"]');

  // Wait for results
  await expect(page.locator("#downsample-downsampled-details")).toContainText(
    "imageType"
  );
});
