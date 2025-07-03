import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.describe("mrc", () => {
  test("Reads an MRC image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to mrcReadImage tab
    await page.click('sl-tab[panel="mrcReadImage-panel"]');

    // Upload test MRC file
    await page.setInputFiles(
      '#mrcReadImageInputs input[name="serialized-image-file"]',
      {
        name: "tilt_series_little.mrc",
        mimeType: "application/octet-stream",
        buffer: readFileSync("../test/data/input/tilt_series_little.mrc"),
      }
    );

    // Verify file was uploaded
    await expect(
      page.locator("#mrcReadImage-serialized-image-details")
    ).toContainText("serializedImage");

    // Run the test
    await page.click('#mrcReadImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(page.locator("#mrcReadImage-image-details")).toContainText(
      "imageType"
    );
    await expect(
      page.locator("#mrcReadImage-could-read-details")
    ).toContainText("couldRead");
  });

  test("Writes an MRC image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to mrcWriteImage tab
    await page.click('sl-tab[panel="mrcWriteImage-panel"]');

    // Upload a test image file
    await page.setInputFiles('#mrcWriteImageInputs input[name="image-file"]', {
      name: "cthead1.png",
      mimeType: "image/png",
      buffer: readFileSync("../test/data/input/cthead1.png"),
    });

    // Verify file was uploaded
    await expect(page.locator("#mrcWriteImage-image-details")).toContainText(
      "imageType"
    );

    // Set output filename
    await page.fill(
      '#mrcWriteImageInputs sl-input[name="serialized-image"] input',
      "output.mrc"
    );

    // Run the test
    await page.click('#mrcWriteImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(
      page.locator("#mrcWriteImage-serialized-image-details")
    ).toContainText("serializedImage");
  });
});
