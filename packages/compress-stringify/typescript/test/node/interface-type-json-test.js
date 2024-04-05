import test from "ava";
import path from "path";

import { readImageNode } from "@itk-wasm/image-io";
import { readMeshNode } from "@itk-wasm/mesh-io";
import { compareImagesNode } from "@itk-wasm/compare-images";
import { compareMeshesNode } from "@itk-wasm/compare-meshes";
import {
  meshToPolyDataNode,
  polyDataToMeshNode,
} from "@itk-wasm/mesh-to-poly-data";

import { testInputPath } from "./common.js";

import {
  imageToJsonNode,
  jsonToImageNode,
  meshToJsonNode,
  jsonToMeshNode,
  polyDataToJsonNode,
  jsonToPolyDataNode,
} from "../../dist/index-node.js";

test("imageToJsonNode, jsonToImageNode roundtrips", async (t) => {
  const testInputFilePath = path.join(testInputPath, "cthead1.png");
  const image = await readImageNode(testInputFilePath);

  const imageJson = await imageToJsonNode(image);
  const jsonImage = await jsonToImageNode(imageJson.encoded);

  const { metrics } = await compareImagesNode(image, {
    baselineImages: [jsonImage.decoded],
  });

  t.true(metrics.almostEqual);
});

test("meshToJsonNode, jsonToMeshNode roundtrips", async (t) => {
  const testInputFilePath = path.join(testInputPath, "cow.vtk");
  const mesh = await readMeshNode(testInputFilePath);

  const meshJson = await meshToJsonNode(mesh);
  const jsonMesh = await jsonToMeshNode(meshJson.encoded);

  const { metrics } = await compareMeshesNode(mesh, {
    baselineMeshes: [jsonMesh.decoded],
  });

  t.true(metrics.almostEqual);
});

test("polyDataToJsonNode, jsonToPolyDataNode roundtrips", async (t) => {
  const testInputFilePath = path.join(testInputPath, "cow.vtk");
  const mesh = await readMeshNode(testInputFilePath);
  const { polyData } = await meshToPolyDataNode(mesh);
  const { mesh: polyDataMesh } = await polyDataToMeshNode(polyData);

  const polyDataJson = await polyDataToJsonNode(polyData);
  const jsonPolyData = await jsonToPolyDataNode(polyDataJson.encoded);

  const { mesh: jsonMesh } = await polyDataToMeshNode(jsonPolyData.decoded);

  const { metrics } = await compareMeshesNode(jsonMesh, {
    baselineMeshes: [polyDataMesh],
  });

  t.true(metrics.almostEqual);
});
