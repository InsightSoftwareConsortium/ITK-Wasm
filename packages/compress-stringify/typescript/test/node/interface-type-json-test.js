import test from "ava";
import path from "path";

import { readImageNode } from "@itk-wasm/image-io";
import { compareImagesNode } from "@itk-wasm/compare-images";

import { testInputPath } from "./common.js";

import { imageToJsonNode, jsonToImageNode } from "../../dist/index-node.js";

test("imageToJsonNode roundtrip", async (t) => {
  const testInputFilePath = path.join(testInputPath, "cthead1.png");
  const image = await readImageNode(testInputFilePath);

  const imageJson = await imageToJsonNode(image);
  const jsonImage = await jsonToImageNode(imageJson.encoded);

  const { metrics } = await compareImagesNode(image, {
    baselineImages: [jsonImage.decoded],
  });

  t.true(metrics.almostEqual);
});
