import test from "ava";
import path from "path";

import {
  hdf5ReadTransformNode,
  hdf5WriteTransformNode,
} from "../../dist/index-node.js";

import {
  testInputPath,
  testOutputPath,
  verifyTestLinearTransform,
} from "./common.js";

const testInputFilePath = path.join(testInputPath, "LinearTransform.h5");
const testOutputFilePath = path.join(
  testOutputPath,
  "hdf5-test-write-LinearTransform.h5"
);

test("Test reading a HDF5 file", async (t) => {
  const { couldRead, transform } = await hdf5ReadTransformNode(
    testInputFilePath
  );
  t.true(couldRead);
  verifyTestLinearTransform(t, transform);
});

test("Test writing a HDF5 transform file", async (t) => {
  const { couldRead, transform } = await hdf5ReadTransformNode(
    testInputFilePath
  );
  t.true(couldRead);

  const { couldWrite } = await hdf5WriteTransformNode(
    transform,
    testOutputFilePath
  );
  t.true(couldWrite);

  const { couldRead: couldReadBack, transform: transformBack } =
    await hdf5ReadTransformNode(testInputFilePath);
  t.true(couldReadBack);
  verifyTestLinearTransform(t, transformBack);
});
