import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.describe("png", () => {
  test("Reads a PNG image", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/cthead1.png");

    // Navigate to pngReadImage tab
    await page.click('sl-tab[panel="pngReadImage-panel"]');

    // Upload file
    await page.setInputFiles(
      '#pngReadImageInputs input[name="serialized-image-file"]',
      {
        name: "cthead1.png",
        mimeType: "image/png",
        buffer: testFile,
      }
    );

    // Wait for input details to appear
    await expect(
      page.locator("#pngReadImage-serialized-image-details")
    ).toContainText("137,80");

    // Run the pipeline
    await page.click('#pngReadImageInputs sl-button[name="run"]');

    // Wait for results - simplified to just check for imageType
    await expect(page.locator("#pngReadImage-image-details")).toContainText(
      "imageType"
    );
  });

  test("Writes a PNG image", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/cthead1.iwi.cbor");

    // Navigate to pngWriteImage tab
    await page.click('sl-tab[panel="pngWriteImage-panel"]');

    // Upload file
    await page.setInputFiles('#pngWriteImageInputs input[name="image-file"]', {
      name: "cthead1.iwi.cbor",
      mimeType: "application/octet-stream",
      buffer: testFile,
    });

    // Wait for input details to appear
    await expect(page.locator("#pngWriteImage-image-details")).toContainText(
      "imageType"
    );

    // Run the pipeline
    await page.click('#pngWriteImageInputs sl-button[name="run"]');

    // Wait for results - just check that some output appears
    await expect(
      page.locator("#pngWriteImage-serialized-image-details")
    ).toBeVisible();
  });
});
