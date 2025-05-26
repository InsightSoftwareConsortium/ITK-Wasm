// @ts-check
import { test, expect } from "@playwright/test";

test("loads an image", async ({ page }) => {
  await page.goto("http://localhost:8085/");

  await expect(page).toHaveTitle(/ITK-Wasm Vite/);

  const fileInput = page.locator("input[type='file']");
  await fileInput.setInputFiles("tests/statue-leg.nrrd");

  const textarea = page.locator("textarea");
  await expect(textarea).toHaveText(/imageType/);
});
