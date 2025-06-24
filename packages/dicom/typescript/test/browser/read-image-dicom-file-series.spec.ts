import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test("reads tags from a dicom file", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("tab", { name: "readImageDicomFileSeries" }).click();

  const inputFiles: { name: string; mimeType: string; buffer: Buffer }[] = [];
  for (let i = 1; i < 4; i++) {
    const inputFile = readFileSync(
      `../test/data/input/DicomImageOrientationTest/ImageOrientation.${i}.dcm`
    );
    inputFiles.push({
      name: `ImageOrientation.${i}.dcm`,
      mimeType: "application/dicom",
      buffer: inputFile,
    });
  }

  await page
    .locator('#readImageDicomFileSeriesInputs input[name="input-images-file"]')
    .setInputFiles(inputFiles);

  await page.getByRole("button", { name: "Run" }).click();

  await expect(
    page.locator("#readImageDicomFileSeries-sorted-filenames-details")
  ).toContainText("ImageOrientation.1.dcm");
});
