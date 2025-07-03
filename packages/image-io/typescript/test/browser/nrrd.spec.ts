import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.describe("nrrd", () => {
  test("Reads an NRRD image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to nrrdReadImage tab
    await page.click('sl-tab[panel="nrrdReadImage-panel"]');

    // Upload test NRRD file
    await page.setInputFiles(
      '#nrrdReadImageInputs input[name="serialized-image-file"]',
      {
        name: "vol-raw-little.nrrd",
        mimeType: "application/octet-stream",
        buffer: readFileSync("../test/data/input/vol-raw-little.nrrd"),
      }
    );

    // Verify file was uploaded
    await expect(
      page.locator("#nrrdReadImage-serialized-image-details")
    ).toContainText("serializedImage");

    // Run the test
    await page.click('#nrrdReadImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(page.locator("#nrrdReadImage-image-details")).toContainText(
      "imageType"
    );
    await expect(
      page.locator("#nrrdReadImage-could-read-details")
    ).toContainText("couldRead");
  });

  test("Writes an NRRD image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to nrrdWriteImage tab
    await page.click('sl-tab[panel="nrrdWriteImage-panel"]');

    // Upload a test image file
    await page.setInputFiles('#nrrdWriteImageInputs input[name="image-file"]', {
      name: "cthead1.png",
      mimeType: "image/png",
      buffer: readFileSync("../test/data/input/cthead1.png"),
    });

    // Verify file was uploaded
    await expect(page.locator("#nrrdWriteImage-image-details")).toContainText(
      "imageType"
    );

    // Set output filename
    await page.fill(
      '#nrrdWriteImageInputs sl-input[name="serialized-image"] input',
      "output.nrrd"
    );

    // Run the test
    await page.click('#nrrdWriteImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(
      page.locator("#nrrdWriteImage-serialized-image-details")
    ).toContainText("serializedImage");
  });
});
