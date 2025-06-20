import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test("Runs on double images", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("tab", { name: "compareImages" }).click();

  const testImage = readFileSync("../test/data/input/cake_easy.iwi.cbor");
  await page
    .locator('#compareImagesInputs input[name="test-image-file"]')
    .setInputFiles({
      name: "cake_easy.iwi.cbor",
      mimeType: "application/cbor",
      buffer: testImage,
    });
  await expect(page.locator("#compareImages-test-image-details")).toContainText(
    "imageType"
  );

  const baselineImage = readFileSync("../test/data/input/cake_hard.iwi.cbor");
  await page
    .locator('#compareImagesInputs input[name="baseline-images-file"]')
    .setInputFiles({
      name: "cake_hard.iwi.cbor",
      mimeType: "application/cbor",
      buffer: baselineImage,
    });
  await expect(
    page.locator("#compareImages-baseline-images-details")
  ).toContainText("imageType");

  await page.getByRole("button", { name: "Run" }).click();

  await expect(page.locator("#compareImages-metrics-details")).toContainText(
    '"almostEqual": false'
  );
});

test("Runs on uint8 images", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("tab", { name: "compareImages" }).click();

  const testImage = readFileSync("../test/data/input/cake_easy.png");
  await page
    .locator('#compareImagesInputs input[name="test-image-file"]')
    .setInputFiles({
      name: "cake_easy.png",
      mimeType: "image/png",
      buffer: testImage,
    });
  await expect(page.locator("#compareImages-test-image-details")).toContainText(
    "imageType"
  );

  const baselineImage = readFileSync("../test/data/input/cake_hard.png");
  await page
    .locator('#compareImagesInputs input[name="baseline-images-file"]')
    .setInputFiles({
      name: "cake_hard.png",
      mimeType: "image/png",
      buffer: baselineImage,
    });
  await expect(
    page.locator("#compareImages-baseline-images-details")
  ).toContainText("imageType");

  await page.getByRole("button", { name: "Run" }).click();

  await expect(page.locator("#compareImages-metrics-details")).toContainText(
    '"almostEqual": false'
  );
});

test("Runs on RGB images", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("tab", { name: "compareImages" }).click();

  const testImage = readFileSync("../test/data/input/apple.jpg");
  await page
    .locator('#compareImagesInputs input[name="test-image-file"]')
    .setInputFiles({
      name: "apple.jpg",
      mimeType: "image/jpeg",
      buffer: testImage,
    });
  await expect(page.locator("#compareImages-test-image-details")).toContainText(
    "imageType"
  );

  const baselineImage = readFileSync("../test/data/input/orange.jpg");
  await page
    .locator('#compareImagesInputs input[name="baseline-images-file"]')
    .setInputFiles({
      name: "orange.jpg",
      mimeType: "image/jpeg",
      buffer: baselineImage,
    });
  await expect(
    page.locator("#compareImages-baseline-images-details")
  ).toContainText("imageType");

  await page.getByRole("button", { name: "Run" }).click();

  await expect(page.locator("#compareImages-metrics-details")).toContainText(
    '"almostEqual": false'
  );
});
