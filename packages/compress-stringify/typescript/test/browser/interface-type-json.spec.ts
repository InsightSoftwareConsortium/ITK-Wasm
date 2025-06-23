import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

test.describe("interface type to json functions", () => {
  test("imageToJson, jsonToImage roundtrips", async ({ page }) => {
    await page.goto("/");

    const testImagePath = "../test/data/input/cthead1.png";
    const imageData = readFileSync(testImagePath);

    const result = await page.evaluate(async (imageDataArray: number[]) => {
      const path = "cthead1.png";
      const imageArrayBuffer = new Uint8Array(imageDataArray).buffer;
      const { image, webWorker } = await (window as any).imageIo.readImage({
        path,
        data: new Uint8Array(imageArrayBuffer),
      });

      const { encoded } = await (window as any).compressStringify.imageToJson(
        image,
        {
          webWorker,
        }
      );

      const jsonImage = await (window as any).compressStringify.jsonToImage(
        encoded,
        {
          webWorker,
        }
      );

      const { metrics } = await (window as any).compareImages.compareImages(
        image,
        {
          baselineImages: [jsonImage.decoded],
        }
      );

      webWorker.terminate();

      return metrics.almostEqual;
    }, Array.from(imageData));

    expect(result).toBe(true);
  });

  test("meshToJson, jsonToMesh roundtrips", async ({ page }) => {
    await page.goto("/");

    const testMeshPath = "../test/data/input/cow.vtk";
    const meshData = readFileSync(testMeshPath);

    const result = await page.evaluate(async (meshDataArray: number[]) => {
      const path = "cow.vtk";
      const meshArrayBuffer = new Uint8Array(meshDataArray).buffer;
      const { mesh, webWorker } = await (window as any).meshIo.readMesh({
        path,
        data: new Uint8Array(meshArrayBuffer),
      });

      const { encoded } = await (window as any).compressStringify.meshToJson(
        mesh,
        {
          webWorker,
        }
      );

      const jsonMesh = await (window as any).compressStringify.jsonToMesh(
        encoded,
        {
          webWorker,
        }
      );

      const { metrics } = await (window as any).compareMeshes.compareMeshes(
        mesh,
        {
          baselineMeshes: [jsonMesh.decoded],
        }
      );

      webWorker.terminate();

      return metrics.almostEqual;
    }, Array.from(meshData));

    expect(result).toBe(true);
  });

  test("polyDataToJson, jsonToPolyData roundtrips", async ({ page }) => {
    await page.goto("/");

    const testMeshPath = "../test/data/input/cow.vtk";
    const meshData = readFileSync(testMeshPath);

    const result = await page.evaluate(async (meshDataArray: number[]) => {
      const path = "cow.vtk";
      const meshArrayBuffer = new Uint8Array(meshDataArray).buffer;
      const { mesh, webWorker } = await (window as any).meshIo.readMesh({
        path,
        data: new Uint8Array(meshArrayBuffer),
      });

      const { polyData } = await (window as any).meshToPolyData.meshToPolyData(
        mesh,
        {
          webWorker,
        }
      );

      const { mesh: polyDataMesh } = await (
        window as any
      ).meshToPolyData.polyDataToMesh(polyData, { webWorker });

      const { encoded } = await (
        window as any
      ).compressStringify.polyDataToJson(polyData, {
        webWorker,
      });

      const jsonPolyData = await (
        window as any
      ).compressStringify.jsonToPolyData(encoded, {
        webWorker,
      });

      const { mesh: jsonPolyDataMesh } = await (
        window as any
      ).meshToPolyData.polyDataToMesh(jsonPolyData.decoded, { webWorker });

      const { metrics } = await (window as any).compareMeshes.compareMeshes(
        jsonPolyDataMesh,
        {
          baselineMeshes: [polyDataMesh],
        }
      );

      webWorker.terminate();

      return metrics.almostEqual;
    }, Array.from(meshData));

    expect(result).toBe(true);
  });
});
