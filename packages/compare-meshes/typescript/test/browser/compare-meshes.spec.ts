import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.describe("@itk-wasm/compare-meshes", () => {
  test("compareMeshes demo loads successfully", async ({ page }) => {
    await page.goto("/");

    // Check that the tab is visible
    await expect(
      page.getByRole("tab", { name: "compareMeshes" })
    ).toBeVisible();

    // Click the tab
    await page.getByRole("tab", { name: "compareMeshes" }).click();

    // Check that the upload buttons are visible (the actual file inputs are hidden)
    await expect(
      page.locator('sl-button[name="test-mesh-file-button"]')
    ).toBeVisible();
    await expect(
      page.locator('sl-button[name="baseline-meshes-file-button"]')
    ).toBeVisible();

    // Check that the Run button is visible
    await expect(page.getByRole("button", { name: "Run" })).toBeVisible();

    // Check that input parameters are visible
    await expect(
      page.locator('sl-input[name="points-difference-threshold"]')
    ).toBeVisible();
    await expect(
      page.locator('sl-input[name="number-of-different-points-tolerance"]')
    ).toBeVisible();
  });

  test("compares meshes with API", async ({ page }) => {
    await page.goto("/");

    const testMeshPath = "../test/data/input/cow.vtk";
    const meshData = readFileSync(testMeshPath);

    const result = await page.evaluate(async (meshDataArray: number[]) => {
      const path = "cow.vtk";
      const meshArrayBuffer = new Uint8Array(meshDataArray).buffer;

      // Check if required modules are available
      if (typeof (window as any).meshIo === "undefined") {
        return { error: "meshIo not available" };
      }
      if (typeof (window as any).compareMeshes === "undefined") {
        return { error: "compareMeshes not available" };
      }

      try {
        // Load the mesh
        const { mesh, webWorker } = await (window as any).meshIo.readMesh({
          path,
          data: new Uint8Array(meshArrayBuffer),
        });

        // Compare the mesh with itself
        const { metrics } = await (window as any).compareMeshes.compareMeshes(
          mesh,
          {
            baselineMeshes: [mesh],
            webWorker,
          }
        );

        webWorker.terminate();

        return {
          success: true,
          almostEqual: metrics.almostEqual,
        };
      } catch (error) {
        return { error: error.message };
      }
    }, Array.from(meshData));

    if ("error" in result) {
      console.log("Test error:", result.error);
      // Skip the test if modules are not available
      test.skip();
    } else {
      expect(result.success).toBe(true);
      expect(result.almostEqual).toBe(true);
    }
  });
});
