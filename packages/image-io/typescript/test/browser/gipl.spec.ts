import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.describe("gipl", () => {
  test("Reads a GIPL image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to giplReadImage tab
    await page.click('sl-tab[panel="giplReadImage-panel"]');

    // Upload test GIPL file
    await page.setInputFiles(
      '#giplReadImageInputs input[name="serialized-image-file"]',
      {
        name: "ramp.gipl",
        mimeType: "application/octet-stream",
        buffer: readFileSync("../test/data/input/ramp.gipl"),
      }
    );

    // Verify file was uploaded
    await expect(
      page.locator("#giplReadImage-serialized-image-details")
    ).toContainText("serializedImage");

    // Run the test
    await page.click('#giplReadImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(page.locator("#giplReadImage-image-details")).toContainText(
      "imageType"
    );
    await expect(
      page.locator("#giplReadImage-could-read-details")
    ).toContainText("couldRead");
  });

  test("Writes a GIPL image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to giplWriteImage tab
    await page.click('sl-tab[panel="giplWriteImage-panel"]');

    // Upload a test image file
    await page.setInputFiles('#giplWriteImageInputs input[name="image-file"]', {
      name: "cthead1.png",
      mimeType: "image/png",
      buffer: readFileSync("../test/data/input/cthead1.png"),
    });

    // Verify file was uploaded
    await expect(page.locator("#giplWriteImage-image-details")).toContainText(
      "imageType"
    );

    // Set output filename
    await page.fill(
      '#giplWriteImageInputs sl-input[name="serialized-image"] input',
      "output.gipl"
    );

    // Run the test
    await page.click('#giplWriteImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(
      page.locator("#giplWriteImage-serialized-image-details")
    ).toContainText("serializedImage");
  });
});
