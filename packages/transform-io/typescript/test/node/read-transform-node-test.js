import test from "ava";
import path from "path";

import { readTransformNode } from "../../dist/index-node.js";
import { testInputPath, verifyTestLinearTransform } from "./common.js";

const testInputFilePath = path.join(testInputPath, "LinearTransform.mat");

test("readTransformNode reads a fil epath given on the local filesystem", async (t) => {
  const transform = await readTransformNode(testInputFilePath);
  verifyTestLinearTransform(t, transform);
});
