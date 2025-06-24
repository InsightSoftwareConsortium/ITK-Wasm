import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test("runs and produces the expected text", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("tab", { name: "structuredReportToText" }).click();

  const inputData = readFileSync(
    "../test/data/input/88.33-comprehensive-SR.dcm"
  );
  await page
    .locator("#structuredReportToTextInputs input[type=file]")
    .setInputFiles({
      name: "inputData.dcm",
      mimeType: "application/dicom",
      buffer: inputData,
    });

  await page.getByRole("button", { name: "Run" }).click();

  await expect(
    page.locator("#structuredReportToText-output-text-details")
  ).toContainText("Comprehensive SR Document");
  await expect(
    page.locator("#structuredReportToText-output-text-details")
  ).toContainText("Breast Imaging Report");
});
