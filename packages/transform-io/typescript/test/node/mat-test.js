import test from "ava";
import path from "path";

import {
  matReadTransformNode,
  matWriteTransformNode,
} from "../../dist/index-node.js";

import {
  testInputPath,
  testOutputPath,
  verifyTestLinearTransform,
} from "./common.js";

const testInputFilePath = path.join(testInputPath, "LinearTransform.mat");
const testOutputFilePath = path.join(
  testOutputPath,
  "mat-test-write-LinearTransform.mat"
);

test("Test reading a .mat file", async (t) => {
  const { couldRead, transform } = await matReadTransformNode(
    testInputFilePath
  );
  t.true(couldRead);
  verifyTestLinearTransform(t, transform);
});

test("Test writing .mat transform file", async (t) => {
  const { couldRead, transform } = await matReadTransformNode(
    testInputFilePath
  );
  t.true(couldRead);

  const { couldWrite } = await matWriteTransformNode(
    transform,
    testOutputFilePath
  );
  t.true(couldWrite);

  const { couldRead: couldReadBack, transform: transformBack } =
    await matReadTransformNode(testOutputFilePath);
  t.true(couldReadBack);
  verifyTestLinearTransform(t, transformBack);
});
