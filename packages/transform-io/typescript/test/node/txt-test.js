import test from "ava";
import path from "path";

import { txtReadTransformNode } from "../../dist/index-node.js";

import { testInputPath, verifyTestLinearTransform } from "./common.js";

const testInputFilePath = path.join(testInputPath, "LinearTransform.txt");

test("Test reading a Insight Legacy TXT transform file", async (t) => {
  const { couldRead, transform } = await txtReadTransformNode(
    testInputFilePath
  );
  t.true(couldRead);
  verifyTestLinearTransform(t, transform);
});
