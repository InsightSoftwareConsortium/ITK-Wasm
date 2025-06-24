import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test("reads segmentation from a dicom file", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("tab", { name: "readSegmentation" }).click();

  const inputFile = readFileSync(
    "../test/data/input/dicom-images/SEG/ReMIND-001/tumor_seg_MR_ref_3DSAGT2SPACE/1-1.dcm"
  );
  await page
    .locator('#readSegmentationInputs input[name="dicom-file-file"]')
    .setInputFiles({
      name: "inputData.dcm",
      mimeType: "application/dicom",
      buffer: inputFile,
    });

  await page.getByRole("button", { name: "Run" }).click();

  await expect(
    page.locator("#readSegmentation-seg-image-details")
  ).toBeVisible();
  await expect(
    page.locator("#readSegmentation-meta-info-details")
  ).toContainText('"labelID": 1');
  await expect(
    page.locator("#readSegmentation-meta-info-details")
  ).toContainText('"BodyPartExamined": "BRAIN"');
});
