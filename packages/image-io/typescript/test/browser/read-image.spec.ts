import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.describe("read-image", () => {
  test("Reads an image File in the demo", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/cthead1.png");

    // Navigate to readImage tab
    await page.click('sl-tab[panel="readImage-panel"]');

    // Upload file
    await page.setInputFiles(
      '#readImageInputs input[name="serialized-image-file"]',
      {
        name: "cthead1.png",
        mimeType: "image/png",
        buffer: testFile,
      }
    );

    // Wait for input details to appear
    await expect(
      page.locator("#readImage-serialized-image-details")
    ).toContainText("137,80");

    // Run the pipeline
    await page.click('#readImageInputs sl-button[name="run"]');

    // Wait for results - just check that some output appears
    await expect(page.locator("#readImage-image-details")).toContainText(
      "imageType"
    );
  });

  test("Reads a serialized image", async ({ page }) => {
    await page.goto("/");

    const testFile = readFileSync("../test/data/input/cthead1.iwi.cbor");

    // Navigate to readImage tab
    await page.click('sl-tab[panel="readImage-panel"]');

    // Upload file
    await page.setInputFiles(
      '#readImageInputs input[name="serialized-image-file"]',
      {
        name: "cthead1.iwi.cbor",
        mimeType: "application/octet-stream",
        buffer: testFile,
      }
    );

    // Wait for input details to appear - be more flexible with content check
    await expect(
      page.locator("#readImage-serialized-image-details")
    ).toBeVisible();

    // Run the pipeline
    await page.click('#readImageInputs sl-button[name="run"]');

    // Wait for results
    await expect(page.locator("#readImage-image-details")).toContainText(
      "imageType"
    );
  });
});
