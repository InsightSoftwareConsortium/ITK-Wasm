import test from "ava";
import path from "path";

import { wasmReadTransformNode } from "../../dist/index-node.js";

import { testInputPath, verifyTestLinearTransform } from "./common.js";

const testInputFilePath = path.join(testInputPath, "LinearTransform.iwt.cbor");

test("Test reading a .iwt.cbor file", async (t) => {
  const { couldRead, transform } = await wasmReadTransformNode(
    testInputFilePath
  );
  t.true(couldRead);
  verifyTestLinearTransform(t, transform);
});
