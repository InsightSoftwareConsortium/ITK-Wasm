import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.describe("mgh", () => {
  test("Reads an MGH image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to mghReadImage tab
    await page.click('sl-tab[panel="mghReadImage-panel"]');

    // Upload test MGH file
    await page.setInputFiles(
      '#mghReadImageInputs input[name="serialized-image-file"]',
      {
        name: "T1.mgz",
        mimeType: "application/gzip",
        buffer: readFileSync("../test/data/input/T1.mgz"),
      }
    );

    // Verify file was uploaded
    await expect(
      page.locator("#mghReadImage-serialized-image-details")
    ).toContainText("serializedImage");

    // Run the test
    await page.click('#mghReadImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(page.locator("#mghReadImage-image-details")).toContainText(
      "imageType"
    );
    await expect(
      page.locator("#mghReadImage-could-read-details")
    ).toContainText("couldRead");
  });

  test("Writes an MGH image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to mghWriteImage tab
    await page.click('sl-tab[panel="mghWriteImage-panel"]');

    // Upload a test image file
    await page.setInputFiles('#mghWriteImageInputs input[name="image-file"]', {
      name: "cthead1.png",
      mimeType: "image/png",
      buffer: readFileSync("../test/data/input/cthead1.png"),
    });

    // Verify file was uploaded
    await expect(page.locator("#mghWriteImage-image-details")).toContainText(
      "imageType"
    );

    // Set output filename
    await page.fill(
      '#mghWriteImageInputs sl-input[name="serialized-image"] input',
      "output.mgz"
    );

    // Run the test
    await page.click('#mghWriteImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(
      page.locator("#mghWriteImage-serialized-image-details")
    ).toContainText("serializedImage");
  });
});
