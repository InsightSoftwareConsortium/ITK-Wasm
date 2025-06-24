import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test("reads a pdf from a dicom file", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("tab", { name: "readDicomEncapsulatedPdf" }).click();

  const inputFile = readFileSync(
    "../test/data/input/104.1-SR-printed-to-pdf.dcm"
  );
  await page
    .locator('#readDicomEncapsulatedPdfInputs input[name="dicom-file-file"]')
    .setInputFiles({
      name: "inputData.dcm",
      mimeType: "application/dicom",
      buffer: inputFile,
    });

  await page.getByRole("button", { name: "Run" }).click();

  await expect(
    page.locator(
      '#readDicomEncapsulatedPdf-pdf-binary-output-details object[type="application/pdf"]'
    )
  ).toBeVisible();
});
