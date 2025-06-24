import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test("applies presentation state to a dicom image", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("tab", { name: "applyPresentationStateToImage" })
    .click();

  const inputFile = readFileSync(
    "../test/data/input/gsps-pstate-test-input-image.dcm"
  );
  await page
    .locator('#applyPresentationStateToImageInputs input[name="image-in-file"]')
    .setInputFiles({
      name: "inputData.dcm",
      mimeType: "application/dicom",
      buffer: inputFile,
    });

  const pstateFile = readFileSync(
    "../test/data/input/gsps-pstate-test-input-pstate.dcm"
  );
  await page
    .locator(
      '#applyPresentationStateToImageInputs input[name="presentation-state-file-file"]'
    )
    .setInputFiles({
      name: "pstateData.dcm",
      mimeType: "application/dicom",
      buffer: pstateFile,
    });

  await page.getByRole("button", { name: "Run" }).click();

  await expect(
    page.locator(
      "#applyPresentationStateToImage-presentation-state-out-stream-details"
    )
  ).toContainText("PresentationLabel");
});
