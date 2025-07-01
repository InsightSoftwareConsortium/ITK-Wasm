import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.describe("bmp", () => {
  test("Reads a BMP image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to bmpReadImage tab
    await page.click('sl-tab[panel="bmpReadImage-panel"]');

    // Upload test BMP file
    await page.setInputFiles(
      '#bmpReadImageInputs input[name="serialized-image-file"]',
      {
        name: "image_color.bmp",
        mimeType: "image/bmp",
        buffer: readFileSync("../test/data/input/image_color.bmp"),
      }
    );

    // Verify file was uploaded
    await expect(
      page.locator("#bmpReadImage-serialized-image-details")
    ).toContainText("serializedImage");

    // Run the test
    await page.click('#bmpReadImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(page.locator("#bmpReadImage-image-details")).toContainText(
      "imageType"
    );
    await expect(
      page.locator("#bmpReadImage-could-read-details")
    ).toContainText("couldRead");
  });

  test("Writes a BMP image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to bmpWriteImage tab
    await page.click('sl-tab[panel="bmpWriteImage-panel"]');

    // Upload a test image file (using a different format to test conversion)
    await page.setInputFiles('#bmpWriteImageInputs input[name="image-file"]', {
      name: "cthead1.png",
      mimeType: "image/png",
      buffer: readFileSync("../test/data/input/cthead1.png"),
    });

    // Verify file was uploaded
    await expect(page.locator("#bmpWriteImage-image-details")).toContainText(
      "imageType"
    );

    // Set output filename
    await page.fill(
      '#bmpWriteImageInputs sl-input[name="serialized-image"] input',
      "output.bmp"
    );

    // Run the test
    await page.click('#bmpWriteImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(
      page.locator("#bmpWriteImage-serialized-image-details")
    ).toContainText("serializedImage");
  });
});
