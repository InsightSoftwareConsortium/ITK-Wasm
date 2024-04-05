import test from "ava";
import path from "path";

import { readImageNode } from "@itk-wasm/image-io";
import { readMeshNode } from "@itk-wasm/mesh-io";
import { compareImagesNode } from "@itk-wasm/compare-images";
import { compareMeshesNode } from "@itk-wasm/compare-meshes";

import { testInputPath } from "./common.js";

import {
  imageToJsonNode,
  jsonToImageNode,
  meshToJsonNode,
  jsonToMeshNode,
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
