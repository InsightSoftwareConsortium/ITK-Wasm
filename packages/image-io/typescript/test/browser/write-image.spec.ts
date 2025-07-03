import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.describe("write-image", () => {
  test("Writes an image File in the demo", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/cthead1.iwi.cbor");

    // Navigate to writeImage tab
    await page.click('sl-tab[panel="writeImage-panel"]');

    // Upload file
    await page.setInputFiles('#writeImageInputs input[name="image-file"]', {
      name: "cthead1.iwi.cbor",
      mimeType: "application/octet-stream",
      buffer: testFile,
    });

    // Wait for input details to appear
    await expect(page.locator("#writeImage-image-details")).toContainText(
      "imageType"
    );

    // Set filename
    const filenameInput = page.locator(
      '#writeImageInputs sl-input[name="serialized-image"] input'
    );
    await filenameInput.clear();
    await filenameInput.fill("written.png");

    // Run the pipeline
    await page.click('#writeImageInputs sl-button[name="run"]');

    // Wait for results - just check that output appears
    await expect(
      page.locator("#writeImage-serialized-image-details")
    ).toBeVisible();
  });
});
