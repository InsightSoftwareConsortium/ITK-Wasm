import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.describe("bio-rad", () => {
  test("Reads a Bio-Rad image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to bioRadReadImage tab
    await page.click('sl-tab[panel="bioRadReadImage-panel"]');

    // Upload test Bio-Rad file
    await page.setInputFiles(
      '#bioRadReadImageInputs input[name="serialized-image-file"]',
      {
        name: "biorad.pic",
        mimeType: "application/octet-stream",
        buffer: readFileSync("../test/data/input/biorad.pic"),
      }
    );

    // Verify file was uploaded
    await expect(
      page.locator("#bioRadReadImage-serialized-image-details")
    ).toContainText("serializedImage");

    // Run the test
    await page.click('#bioRadReadImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(page.locator("#bioRadReadImage-image-details")).toContainText(
      "imageType"
    );
    await expect(
      page.locator("#bioRadReadImage-could-read-details")
    ).toContainText("couldRead");
  });

  test("Writes a Bio-Rad image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to bioRadWriteImage tab
    await page.click('sl-tab[panel="bioRadWriteImage-panel"]');

    // Upload a test image file
    await page.setInputFiles(
      '#bioRadWriteImageInputs input[name="image-file"]',
      {
        name: "cthead1.png",
        mimeType: "image/png",
        buffer: readFileSync("../test/data/input/cthead1.png"),
      }
    );

    // Verify file was uploaded
    await expect(page.locator("#bioRadWriteImage-image-details")).toContainText(
      "imageType"
    );

    // Set output filename
    await page.fill(
      '#bioRadWriteImageInputs sl-input[name="serialized-image"] input',
      "output.pic"
    );

    // Run the test
    await page.click('#bioRadWriteImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(
      page.locator("#bioRadWriteImage-serialized-image-details")
    ).toContainText("serializedImage");
  });
});
