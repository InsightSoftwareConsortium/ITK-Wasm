import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.describe("fdf", () => {
  test("Reads an FDF image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to fdfReadImage tab
    await page.click('sl-tab[panel="fdfReadImage-panel"]');

    // Upload test FDF file
    await page.setInputFiles(
      '#fdfReadImageInputs input[name="serialized-image-file"]',
      {
        name: "test.fdf",
        mimeType: "application/octet-stream",
        buffer: readFileSync("../test/data/input/test.fdf"),
      }
    );

    // Verify file was uploaded
    await expect(
      page.locator("#fdfReadImage-serialized-image-details")
    ).toContainText("serializedImage");

    // Run the test
    await page.click('#fdfReadImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(page.locator("#fdfReadImage-image-details")).toContainText(
      "imageType"
    );
    await expect(
      page.locator("#fdfReadImage-could-read-details")
    ).toContainText("couldRead");
  });

  test("Writes an FDF image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to fdfWriteImage tab
    await page.click('sl-tab[panel="fdfWriteImage-panel"]');

    // Upload a test image file
    await page.setInputFiles('#fdfWriteImageInputs input[name="image-file"]', {
      name: "cthead1.png",
      mimeType: "image/png",
      buffer: readFileSync("../test/data/input/cthead1.png"),
    });

    // Verify file was uploaded
    await expect(page.locator("#fdfWriteImage-image-details")).toContainText(
      "imageType"
    );

    // Set output filename
    await page.fill(
      '#fdfWriteImageInputs sl-input[name="serialized-image"] input',
      "output.fdf"
    );

    // Run the test
    await page.click('#fdfWriteImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(
      page.locator("#fdfWriteImage-serialized-image-details")
    ).toContainText("serializedImage");
  });
});
