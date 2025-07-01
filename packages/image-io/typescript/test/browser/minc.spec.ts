import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.describe("minc", () => {
  test("Reads a MINC image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to mincReadImage tab
    await page.click('sl-tab[panel="mincReadImage-panel"]');

    // Upload test MINC file
    await page.setInputFiles(
      '#mincReadImageInputs input[name="serialized-image-file"]',
      {
        name: "t1_z+_short_cor.mnc",
        mimeType: "application/octet-stream",
        buffer: readFileSync("../test/data/input/t1_z+_short_cor.mnc"),
      }
    );

    // Verify file was uploaded
    await expect(
      page.locator("#mincReadImage-serialized-image-details")
    ).toContainText("serializedImage");

    // Run the test
    await page.click('#mincReadImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(page.locator("#mincReadImage-image-details")).toContainText(
      "imageType"
    );
    await expect(
      page.locator("#mincReadImage-could-read-details")
    ).toContainText("couldRead");
  });

  test("Writes a MINC image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to mincWriteImage tab
    await page.click('sl-tab[panel="mincWriteImage-panel"]');

    // Upload a test image file
    await page.setInputFiles('#mincWriteImageInputs input[name="image-file"]', {
      name: "cthead1.png",
      mimeType: "image/png",
      buffer: readFileSync("../test/data/input/cthead1.png"),
    });

    // Verify file was uploaded
    await expect(page.locator("#mincWriteImage-image-details")).toContainText(
      "imageType"
    );

    // Set output filename
    await page.fill(
      '#mincWriteImageInputs sl-input[name="serialized-image"] input',
      "output.mnc"
    );

    // Run the test
    await page.click('#mincWriteImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(
      page.locator("#mincWriteImage-serialized-image-details")
    ).toContainText("serializedImage");
  });
});
