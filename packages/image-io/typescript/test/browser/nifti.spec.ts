import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.describe("nifti", () => {
  test("Reads a NIfTI image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to niftiReadImage tab
    await page.click('sl-tab[panel="niftiReadImage-panel"]');

    // Upload test NIfTI file
    await page.setInputFiles(
      '#niftiReadImageInputs input[name="serialized-image-file"]',
      {
        name: "r16slice.nii.gz",
        mimeType: "application/gzip",
        buffer: readFileSync("../test/data/input/r16slice.nii.gz"),
      }
    );

    // Verify file was uploaded
    await expect(
      page.locator("#niftiReadImage-serialized-image-details")
    ).toContainText("serializedImage");

    // Run the test
    await page.click('#niftiReadImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(page.locator("#niftiReadImage-image-details")).toContainText(
      "imageType"
    );
    await expect(
      page.locator("#niftiReadImage-could-read-details")
    ).toContainText("couldRead");
  });

  test("Writes a NIfTI image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to niftiWriteImage tab
    await page.click('sl-tab[panel="niftiWriteImage-panel"]');

    // Upload a test image file
    await page.setInputFiles(
      '#niftiWriteImageInputs input[name="image-file"]',
      {
        name: "cthead1.png",
        mimeType: "image/png",
        buffer: readFileSync("../test/data/input/cthead1.png"),
      }
    );

    // Verify file was uploaded
    await expect(page.locator("#niftiWriteImage-image-details")).toContainText(
      "imageType"
    );

    // Set output filename
    await page.fill(
      '#niftiWriteImageInputs sl-input[name="serialized-image"] input',
      "output.nii.gz"
    );

    // Run the test
    await page.click('#niftiWriteImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(
      page.locator("#niftiWriteImage-serialized-image-details")
    ).toContainText("serializedImage");
  });
});
