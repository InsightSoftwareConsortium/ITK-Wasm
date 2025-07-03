import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.describe("tiff", () => {
  test("Reads a TIFF image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to tiffReadImage tab
    await page.click('sl-tab[panel="tiffReadImage-panel"]');

    // Upload test TIFF file
    await page.setInputFiles(
      '#tiffReadImageInputs input[name="serialized-image-file"]',
      {
        name: "ShortTestImage.tiff",
        mimeType: "image/tiff",
        buffer: readFileSync("../test/data/input/ShortTestImage.tiff"),
      }
    );

    // Verify file was uploaded
    await expect(
      page.locator("#tiffReadImage-serialized-image-details")
    ).toContainText("serializedImage");

    // Run the test
    await page.click('#tiffReadImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(page.locator("#tiffReadImage-image-details")).toContainText(
      "imageType"
    );
    await expect(
      page.locator("#tiffReadImage-could-read-details")
    ).toContainText("couldRead");
  });

  test("Writes a TIFF image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to tiffWriteImage tab
    await page.click('sl-tab[panel="tiffWriteImage-panel"]');

    // Upload a test image file
    await page.setInputFiles('#tiffWriteImageInputs input[name="image-file"]', {
      name: "cthead1.png",
      mimeType: "image/png",
      buffer: readFileSync("../test/data/input/cthead1.png"),
    });

    // Verify file was uploaded
    await expect(page.locator("#tiffWriteImage-image-details")).toContainText(
      "imageType"
    );

    // Set output filename
    await page.fill(
      '#tiffWriteImageInputs sl-input[name="serialized-image"] input',
      "output.tiff"
    );

    // Run the test
    await page.click('#tiffWriteImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(
      page.locator("#tiffWriteImage-serialized-image-details")
    ).toContainText("serializedImage");
  });
});
