import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.describe("jpeg", () => {
  test("Reads a JPEG image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to jpegReadImage tab
    await page.click('sl-tab[panel="jpegReadImage-panel"]');

    // Upload test JPEG file
    await page.setInputFiles(
      '#jpegReadImageInputs input[name="serialized-image-file"]',
      {
        name: "apple.jpg",
        mimeType: "image/jpeg",
        buffer: readFileSync("../test/data/input/apple.jpg"),
      }
    );

    // Verify file was uploaded
    await expect(
      page.locator("#jpegReadImage-serialized-image-details")
    ).toContainText("serializedImage");

    // Run the test
    await page.click('#jpegReadImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(page.locator("#jpegReadImage-image-details")).toContainText(
      "imageType"
    );
    await expect(
      page.locator("#jpegReadImage-could-read-details")
    ).toContainText("couldRead");
  });

  test("Writes a JPEG image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to jpegWriteImage tab
    await page.click('sl-tab[panel="jpegWriteImage-panel"]');

    // Upload a test image file
    await page.setInputFiles('#jpegWriteImageInputs input[name="image-file"]', {
      name: "cthead1.png",
      mimeType: "image/png",
      buffer: readFileSync("../test/data/input/cthead1.png"),
    });

    // Verify file was uploaded
    await expect(page.locator("#jpegWriteImage-image-details")).toContainText(
      "imageType"
    );

    // Set output filename
    await page.fill(
      '#jpegWriteImageInputs sl-input[name="serialized-image"] input',
      "output.jpg"
    );

    // Run the test
    await page.click('#jpegWriteImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(
      page.locator("#jpegWriteImage-serialized-image-details")
    ).toContainText("serializedImage");
  });
});
