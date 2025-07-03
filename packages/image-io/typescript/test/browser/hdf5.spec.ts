import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.describe("hdf5", () => {
  test("Reads an HDF5 image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to hdf5ReadImage tab
    await page.click('sl-tab[panel="hdf5ReadImage-panel"]');

    // Upload test HDF5 file
    await page.setInputFiles(
      '#hdf5ReadImageInputs input[name="serialized-image-file"]',
      {
        name: "ITKImage.hdf5",
        mimeType: "application/octet-stream",
        buffer: readFileSync("../test/data/input/ITKImage.hdf5"),
      }
    );

    // Verify file was uploaded
    await expect(
      page.locator("#hdf5ReadImage-serialized-image-details")
    ).toContainText("serializedImage");

    // Run the test
    await page.click('#hdf5ReadImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(page.locator("#hdf5ReadImage-image-details")).toContainText(
      "imageType"
    );
    await expect(
      page.locator("#hdf5ReadImage-could-read-details")
    ).toContainText("couldRead");
  });

  test("Writes an HDF5 image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to hdf5WriteImage tab
    await page.click('sl-tab[panel="hdf5WriteImage-panel"]');

    // Upload a test image file
    await page.setInputFiles('#hdf5WriteImageInputs input[name="image-file"]', {
      name: "cthead1.png",
      mimeType: "image/png",
      buffer: readFileSync("../test/data/input/cthead1.png"),
    });

    // Verify file was uploaded
    await expect(page.locator("#hdf5WriteImage-image-details")).toContainText(
      "imageType"
    );

    // Set output filename
    await page.fill(
      '#hdf5WriteImageInputs sl-input[name="serialized-image"] input',
      "output.hdf5"
    );

    // Run the test
    await page.click('#hdf5WriteImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(
      page.locator("#hdf5WriteImage-serialized-image-details")
    ).toContainText("serializedImage");
  });
});
