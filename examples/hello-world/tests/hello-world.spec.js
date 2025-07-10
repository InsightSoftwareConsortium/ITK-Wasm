// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Wasm Hello World", () => {
  test("successfully runs", async ({ page }) => {
    await page.goto("/");

    const textarea = page.locator("textarea");
    await expect(textarea).toContainText("Hello Wasm world!");
  });
});
