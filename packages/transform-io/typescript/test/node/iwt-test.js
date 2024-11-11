import test from "ava";
import path from "path";

import {
  wasmReadTransformNode,
  wasmWriteTransformNode,
} from "../../dist/index-node.js";

import {
  testInputPath,
  testOutputPath,
  verifyTestLinearTransform,
} from "./common.js";

const testInputFilePath = path.join(testInputPath, "LinearTransform.iwt.cbor");
const testOutputFilePath = path.join(
  testOutputPath,
  "wasm-test-write-LinearTransform.iwt.cbor"
);

test("Test reading a .iwt.cbor file", async (t) => {
  const { couldRead, transform } = await wasmReadTransformNode(
    testInputFilePath
  );
  t.true(couldRead);
  verifyTestLinearTransform(t, transform);
});

test("Test writing .iwt.cbor transform file", async (t) => {
  const { couldRead, transform } = await wasmReadTransformNode(
    testInputFilePath
  );
  t.true(couldRead);

  const { couldWrite } = await wasmWriteTransformNode(
    transform,
    testOutputFilePath
  );
  t.true(couldWrite);

  const { couldRead: couldReadBack, transform: transformBack } =
    await wasmReadTransformNode(testOutputFilePath);
  t.true(couldReadBack);
  verifyTestLinearTransform(t, transformBack);
});
