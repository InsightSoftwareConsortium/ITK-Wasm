import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test("runs and produces the expected text", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("tab", { name: "structuredReportToHtml" }).click();

  const inputData = readFileSync(
    "../test/data/input/88.33-comprehensive-SR.dcm"
  );
  await page
    .locator('#structuredReportToHtmlInputs input[name="dicom-file-file"]')
    .setInputFiles({
      name: "inputData.dcm",
      mimeType: "application/dicom",
      buffer: inputData,
    });

  await page.getByRole("button", { name: "Run" }).click();

  await expect(
    page.locator("#structuredReportToHtml-html-output-details iframe")
  ).toBeVisible();
});
