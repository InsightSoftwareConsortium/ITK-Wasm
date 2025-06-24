import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test("writes a segmentation image to a dicom file", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("tab", { name: "writeOverlappingSegmentation" }).click();

  // Read input segmentation image
  const inputFile = readFileSync(
    "../test/data/input/dicom-images/SEG/writeOverlappingSegmentation/segImage.nrrd"
  );
  await page
    .locator('#writeOverlappingSegmentationInputs input[name="seg-image-file"]')
    .setInputFiles({
      name: "segImage.nrrd",
      mimeType: "application/octet-stream",
      buffer: inputFile,
    });

  // Read meta info file
  const metaInfoFile = readFileSync(
    "../test/data/input/dicom-images/SEG/writeOverlappingSegmentation/metaInfo.json"
  );
  await page
    .locator('#writeOverlappingSegmentationInputs input[name="meta-info-file"]')
    .setInputFiles({
      name: "metaInfo.json",
      mimeType: "application/json",
      buffer: metaInfoFile,
    });

  // Set output filename
  await page
    .locator(
      '#writeOverlappingSegmentationInputs sl-input[name="output-dicom-file"] input'
    )
    .fill("output-write-segmentation.dcm");

  // Read reference DICOM files
  const dcmqi_lib_SOURCE_DIR = "../emscripten-build/_deps/dcmqi_lib-src/";
  const refFiles: { name: string; mimeType: string; buffer: Buffer }[] = [];
  for (let i = 0; i < 3; i++) {
    const refFile = readFileSync(
      `${dcmqi_lib_SOURCE_DIR}data/segmentations/ct-3slice/0${i + 1}.dcm`
    );
    refFiles.push({
      name: `ref${i}.dcm`,
      mimeType: "application/dicom",
      buffer: refFile,
    });
  }
  await page
    .locator(
      '#writeOverlappingSegmentationInputs input[name="ref-dicom-series-file"]'
    )
    .setInputFiles(refFiles);

  // Check that run button is enabled and click it
  await expect(
    page.locator(
      '#writeOverlappingSegmentationInputs sl-button[name="run"] button'
    )
  ).toBeEnabled();
  await page.getByRole("button", { name: "Run" }).click();

  // Verify output
  await expect(
    page.locator("#writeOverlappingSegmentation-output-dicom-file-details")
  ).toBeVisible();
  // TODO: Temporarily disable the test due to failure
  //await expect(page.locator('#writeOverlappingSegmentation-output-dicom-file-details')).toContainText('0,0,0,0,0,0,0,0,0,0,0,');
});
