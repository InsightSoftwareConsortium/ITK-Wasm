import test from "ava";
import path from "path";

import {
  objReadPointSetNode,
  objWritePointSetNode,
} from "../../dist/index-node.js";
import { FloatTypes, PixelTypes } from "itk-wasm";

import { testInputPath, testOutputPath } from "./common.js";

const testInputFilePath = path.resolve(testInputPath, "box-points.obj");
const testOutputFilePath = path.resolve(
  testOutputPath,
  "obj-point-set-test-box.obj",
);

const verifyPointSet = (t, pointSet) => {
  t.is(pointSet.pointSetType.dimension, 3);
  t.is(pointSet.pointSetType.pointComponentType, FloatTypes.Float32);
  t.is(pointSet.pointSetType.pointPixelType, PixelTypes.Vector);
  t.is(pointSet.numberOfPoints, 8);
};

test("objReadPointSetNode reads a OBJ file path given on the local filesystem", async (t) => {
  const { couldRead, pointSet } = await objReadPointSetNode(testInputFilePath);
  t.true(couldRead);
  verifyPointSet(t, pointSet);
});

// test("objWritePointSetNode writes a OBJ file path on the local filesystem", async (t) => {
//   const { couldRead, pointSet } = await objReadPointSetNode(testInputFilePath);
//   t.true(couldRead);

//   const useCompression = false;
//   const { couldWrite } = await objWritePointSetNode(
//     pointSet,
//     testOutputFilePath,
//     {
//       useCompression,
//     },
//   );
//   t.true(couldWrite);

//   const { couldRead: couldReadBack, pointSet: pointSetBack } =
//     await objReadPointSetNode(testOutputFilePath);
//   t.true(couldReadBack);
//   verifyPointSet(t, pointSetBack);
// });
