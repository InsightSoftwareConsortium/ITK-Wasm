import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test("reads segmentation from a dicom file", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("tab", { name: "readOverlappingSegmentation" }).click();

  const inputFile = readFileSync("../test/data/output/liver_heart_seg.dcm");
  await page
    .locator('#readOverlappingSegmentationInputs input[name="dicom-file-file"]')
    .setInputFiles({
      name: "inputData.dcm",
      mimeType: "application/dicom",
      buffer: inputFile,
    });

  await page.getByRole("button", { name: "Run" }).click();

  await expect(
    page.locator("#readOverlappingSegmentation-seg-image-details")
  ).toBeVisible();
  //await expect(page.locator('#readOverlappingSegmentation-seg-image-details')).toContainText('"pixelType": "VariableLengthVector"');
  await expect(
    page.locator("#readOverlappingSegmentation-meta-info-details")
  ).toContainText('"SegmentLabel": "Liver"');
  await expect(
    page.locator("#readOverlappingSegmentation-meta-info-details")
  ).toContainText('"labelID": 1');
  await expect(
    page.locator("#readOverlappingSegmentation-meta-info-details")
  ).toContainText('"SegmentLabel": "Thoracic spine"');
  await expect(
    page.locator("#readOverlappingSegmentation-meta-info-details")
  ).toContainText('"labelID": 2');
  await expect(
    page.locator("#readOverlappingSegmentation-meta-info-details")
  ).toContainText('"SegmentLabel": "Heart"');
  await expect(
    page.locator("#readOverlappingSegmentation-meta-info-details")
  ).toContainText('"labelID": 3');
});
