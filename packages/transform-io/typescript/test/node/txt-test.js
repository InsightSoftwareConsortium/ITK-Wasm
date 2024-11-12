import test from "ava";
import path from "path";

import {
  txtReadTransformNode,
  txtWriteTransformNode,
} from "../../dist/index-node.js";

import {
  testInputPath,
  testOutputPath,
  verifyTestLinearTransform,
} from "./common.js";

const testInputFilePath = path.join(testInputPath, "LinearTransform.txt");
const testOutputFilePath = path.join(
  testOutputPath,
  "txt-test-write-LinearTransform.txt"
);

test("Test reading an Insight Legacy TXT transform file", async (t) => {
  const { couldRead, transform } = await txtReadTransformNode(
    testInputFilePath
  );
  t.true(couldRead);
  verifyTestLinearTransform(t, transform);
});

test("Test writing an Insight Legacy TXT transform file", async (t) => {
  const { couldRead, transform } = await txtReadTransformNode(
    testInputFilePath
  );
  t.true(couldRead);

  const { couldWrite } = await txtWriteTransformNode(
    transform,
    testOutputFilePath
  );
  t.true(couldWrite);

  const { couldRead: couldReadBack, transform: transformBack } =
    await txtReadTransformNode(testOutputFilePath);
  t.true(couldReadBack);
  verifyTestLinearTransform(t, transformBack);
});
