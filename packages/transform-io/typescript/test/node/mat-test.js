import test from "ava";
import path from "path";

import { matReadTransformNode } from "../../dist/index-node.js";

import { testInputPath, verifyTestLinearTransform } from "./common.js";

const testInputFilePath = path.join(testInputPath, "LinearTransform.mat");

test("Test reading a .mat file", async (t) => {
  const { couldRead, transform } = await matReadTransformNode(
    testInputFilePath
  );
  t.true(couldRead);
  verifyTestLinearTransform(t, transform);
});
