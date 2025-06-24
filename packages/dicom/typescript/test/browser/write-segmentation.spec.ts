import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test("writes a segmentation image to a dicom file", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("tab", { name: "writeSegmentation" }).click();

  // Read input segmentation file
  const inputFile = readFileSync(
    "../test/data/input/dicom-images/SEG/ReMIND-001/tumor_seg_MR_ref_3DSAGT2SPACE.nrrd"
  );
  await page
    .locator('#writeSegmentationInputs input[name="seg-image-file"]')
    .setInputFiles({
      name: "inputData.nrrd",
      mimeType: "application/octet-stream",
      buffer: inputFile,
    });

  // Read meta info file
  const metaInfoFile = readFileSync(
    "../test/data/baseline/dicom-images/SEG/MR_ref_3DSAGT2SPACE_tumor_seg.json"
  );
  await page
    .locator('#writeSegmentationInputs input[name="meta-info-file"]')
    .setInputFiles({
      name: "inputData.json",
      mimeType: "application/json",
      buffer: metaInfoFile,
    });

  // Set output filename
  await page
    .locator(
      '#writeSegmentationInputs sl-input[name="output-dicom-file"] input'
    )
    .fill("output_write_segmentation.dcm");

  // Read reference DICOM files
  const testPathPrefix = "../test/data/input/dicom-images/";
  const refFiles: { name: string; mimeType: string; buffer: Buffer }[] = [];
  const refFileNames = [
    "SEG/ReMIND-001/3DSAGT2SPACE/1-001.dcm",
    "SEG/ReMIND-001/3DSAGT2SPACE/1-002.dcm",
    "SEG/ReMIND-001/3DSAGT2SPACE/1-003.dcm",
  ];

  for (let i = 0; i < 3; i++) {
    const refFile = readFileSync(`${testPathPrefix}${refFileNames[i]}`);
    refFiles.push({
      name: `ref${i}.dcm`,
      mimeType: "application/dicom",
      buffer: refFile,
    });
  }
  await page
    .locator('#writeSegmentationInputs input[name="ref-dicom-series-file"]')
    .setInputFiles(refFiles);

  // Click run button (original test clicked twice for some reason)
  await page.getByRole("button", { name: "Run" }).click();
  await page.getByRole("button", { name: "Run" }).click();

  // Verify output
  await expect(
    page.locator("#writeSegmentation-seg-image-details")
  ).toBeVisible();
  await expect(
    page.locator("#writeSegmentation-output-dicom-file-details")
  ).toBeVisible();
  // await expect(page.locator('#writeSegmentation-output-dicom-file-details')).toContainText('0,0,0,0,0,0,0,0,0,0,0,');
});
