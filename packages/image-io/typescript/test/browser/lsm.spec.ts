import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.describe("lsm", () => {
  test("Reads an LSM image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to lsmReadImage tab
    await page.click('sl-tab[panel="lsmReadImage-panel"]');

    // Upload test LSM file
    await page.setInputFiles(
      '#lsmReadImageInputs input[name="serialized-image-file"]',
      {
        name: "cthead1.lsm",
        mimeType: "application/octet-stream",
        buffer: readFileSync("../test/data/input/cthead1.lsm"),
      }
    );

    // Verify file was uploaded
    await expect(
      page.locator("#lsmReadImage-serialized-image-details")
    ).toContainText("serializedImage");

    // Run the test
    await page.click('#lsmReadImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(page.locator("#lsmReadImage-image-details")).toContainText(
      "imageType"
    );
    await expect(
      page.locator("#lsmReadImage-could-read-details")
    ).toContainText("couldRead");
  });

  test("Writes an LSM image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to lsmWriteImage tab
    await page.click('sl-tab[panel="lsmWriteImage-panel"]');

    // Upload a test image file
    await page.setInputFiles('#lsmWriteImageInputs input[name="image-file"]', {
      name: "cthead1.png",
      mimeType: "image/png",
      buffer: readFileSync("../test/data/input/cthead1.png"),
    });

    // Verify file was uploaded
    await expect(page.locator("#lsmWriteImage-image-details")).toContainText(
      "imageType"
    );

    // Set output filename
    await page.fill(
      '#lsmWriteImageInputs sl-input[name="serialized-image"] input',
      "output.lsm"
    );

    // Run the test
    await page.click('#lsmWriteImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(
      page.locator("#lsmWriteImage-serialized-image-details")
    ).toContainText("serializedImage");
  });
});
