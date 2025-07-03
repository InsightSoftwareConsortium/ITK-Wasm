import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.describe("vtk", () => {
  test("Reads a VTK image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to vtkReadImage tab
    await page.click('sl-tab[panel="vtkReadImage-panel"]');

    // Upload test VTK file
    await page.setInputFiles(
      '#vtkReadImageInputs input[name="serialized-image-file"]',
      {
        name: "ironProt.vtk",
        mimeType: "application/octet-stream",
        buffer: readFileSync("../test/data/input/ironProt.vtk"),
      }
    );

    // Verify file was uploaded
    await expect(
      page.locator("#vtkReadImage-serialized-image-details")
    ).toContainText("serializedImage");

    // Run the test
    await page.click('#vtkReadImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(page.locator("#vtkReadImage-image-details")).toContainText(
      "imageType"
    );
    await expect(
      page.locator("#vtkReadImage-could-read-details")
    ).toContainText("couldRead");
  });

  test("Writes a VTK image in the demo", async ({ page }) => {
    await page.goto("/");

    // Navigate to vtkWriteImage tab
    await page.click('sl-tab[panel="vtkWriteImage-panel"]');

    // Upload a test image file
    await page.setInputFiles('#vtkWriteImageInputs input[name="image-file"]', {
      name: "cthead1.png",
      mimeType: "image/png",
      buffer: readFileSync("../test/data/input/cthead1.png"),
    });

    // Verify file was uploaded
    await expect(page.locator("#vtkWriteImage-image-details")).toContainText(
      "imageType"
    );

    // Set output filename
    await page.fill(
      '#vtkWriteImageInputs sl-input[name="serialized-image"] input',
      "output.vtk"
    );

    // Run the test
    await page.click('#vtkWriteImageInputs sl-button[name="run"]');

    // Wait for and verify output
    await expect(
      page.locator("#vtkWriteImage-serialized-image-details")
    ).toContainText("serializedImage");
  });
});
