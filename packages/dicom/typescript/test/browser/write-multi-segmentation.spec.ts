import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test("writes a segmentation image to a dicom file", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("tab", { name: "writeMultiSegmentation" }).click();

  const dcmqi_lib_SOURCE_DIR = "../emscripten-build/_deps/dcmqi_lib-src/";

  // Read the input segmentation files
  const inputFiles: { name: string; mimeType: string; buffer: Buffer }[] = [];
  for (let i = 0; i < 3; i++) {
    const inputFile = readFileSync(
      `${dcmqi_lib_SOURCE_DIR}data/segmentations/partial_overlaps-${i + 1}.nrrd`
    );
    inputFiles.push({
      name: `input${i}.nrrd`,
      mimeType: "application/octet-stream",
      buffer: inputFile,
    });
  }
  await page
    .locator('#writeMultiSegmentationInputs input[name="seg-images-file"]')
    .setInputFiles(inputFiles);

  // Set meta info file
  const metaInfoFile = readFileSync(
    `${dcmqi_lib_SOURCE_DIR}doc/examples/seg-example_partial_overlaps.json`
  );
  await page
    .locator('#writeMultiSegmentationInputs input[name="meta-info-file"]')
    .setInputFiles({
      name: "input-metainfo.json",
      mimeType: "application/json",
      buffer: metaInfoFile,
    });

  // Set output filename
  await page
    .locator(
      '#writeMultiSegmentationInputs sl-input[name="output-dicom-file"] input'
    )
    .fill("output-write-segmentation.dcm");

  // Set reference DICOM files
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
      '#writeMultiSegmentationInputs input[name="ref-dicom-series-file"]'
    )
    .setInputFiles(refFiles);

  // Check that run button is enabled and click it
  await expect(
    page.locator('#writeMultiSegmentationInputs sl-button[name="run"] button')
  ).toBeEnabled();
  await page.getByRole("button", { name: "Run" }).click();

  // Verify output
  await expect(
    page.locator("#writeMultiSegmentation-output-dicom-file-details")
  ).toBeVisible();
  await expect(
    page.locator("#writeMultiSegmentation-output-dicom-file-details")
  ).toContainText("0,0,0,0,0,0,0,0,0,0,0,");
});
