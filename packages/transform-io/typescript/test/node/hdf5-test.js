import test from "ava";
import path from "path";

import { hdf5ReadTransformNode } from "../../dist/index-node.js";

import { testInputPath, verifyTestLinearTransform } from "./common.js";

const testInputFilePath = path.join(testInputPath, "LinearTransform.h5");

test("Test reading a HDF5 file", async (t) => {
  const { couldRead, transform } = await hdf5ReadTransformNode(
    testInputFilePath
  );
  t.true(couldRead);
  verifyTestLinearTransform(t, transform);
});
