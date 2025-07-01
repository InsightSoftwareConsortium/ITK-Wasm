import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.describe("meta-image", () => {
  test("Reads a Meta image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to metaReadImage tab
    await page.click('sl-tab[panel="metaReadImage-panel"]');

    // Upload test MHA file
    await page.setInputFiles(
      '#metaReadImageInputs input[name="serialized-image-file"]',
      {
        name: "brainweb165a10f17.mha",
        mimeType: "application/octet-stream",
        buffer: readFileSync("../test/data/input/brainweb165a10f17.mha"),
      }
    );

    // Verify file was uploaded
    await expect(
      page.locator("#metaReadImage-serialized-image-details")
    ).toContainText("serializedImage");

    // Run the test
    await page.click('#metaReadImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(page.locator("#metaReadImage-image-details")).toContainText(
      "imageType"
    );
    await expect(
      page.locator("#metaReadImage-could-read-details")
    ).toContainText("couldRead");
  });

  test("Writes a Meta image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to metaWriteImage tab
    await page.click('sl-tab[panel="metaWriteImage-panel"]');

    // Upload a test image file
    await page.setInputFiles('#metaWriteImageInputs input[name="image-file"]', {
      name: "cthead1.png",
      mimeType: "image/png",
      buffer: readFileSync("../test/data/input/cthead1.png"),
    });

    // Verify file was uploaded
    await expect(page.locator("#metaWriteImage-image-details")).toContainText(
      "imageType"
    );

    // Set output filename
    await page.fill(
      '#metaWriteImageInputs sl-input[name="serialized-image"] input',
      "output.mha"
    );

    // Run the test
    await page.click('#metaWriteImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(
      page.locator("#metaWriteImage-serialized-image-details")
    ).toContainText("serializedImage");
  });
});
