// @ts-check
const { test, expect } = require("@playwright/test");

test("Hello World in browser", async ({ page }) => {
  // Navigate to the hello world example page
  await page.goto("http://localhost:8083");

  // Wait for the page to load
  await page.waitForLoadState("networkidle");

  // Look for elements that might contain our hello world output
  // This is a basic test - you may need to adjust based on your actual HTML structure
  const textContent = await page.textContent("body");
  expect(textContent).toContain("Hello");
});
