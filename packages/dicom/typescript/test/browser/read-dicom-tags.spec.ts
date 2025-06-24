import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

// Passes locally but fails in CI - keeping as skip for now
test.skip("reads tags from a dicom file", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("tab", { name: "readDicomTags" }).click();

  const inputFile = readFileSync(
    "../test/data/input/dicom-images/ultrasound.dcm"
  );
  await page
    .locator('#readDicomTagsInputs input[name="dicom-file-file"]')
    .setInputFiles({
      name: "inputData.dcm",
      mimeType: "application/dicom",
      buffer: inputFile,
    });

  await page.getByRole("button", { name: "Run" }).click();

  await expect(page.locator("#readDicomTags-tags-details")).toContainText(
    "0008|0005"
  );
});
