import test from "ava";
import path from "path";

import { mz3ReadMeshNode, mz3WriteMeshNode } from "../../dist/index-node.js";
import { IntTypes, FloatTypes, PixelTypes } from "itk-wasm";

import { testInputPath, testOutputPath } from "./common.js";

const testInputFilePath = path.resolve(testInputPath, "11ScalarMesh.mz3");
const testOutputFilePath = path.resolve(
  testOutputPath,
  "mz3-test-11ScalarMesh.mz3"
);

const verifyMesh = (t, mesh) => {
  t.is(mesh.meshType.dimension, 3);
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float32);
  t.is(mesh.meshType.cellComponentType, IntTypes.UInt32);
  t.is(mesh.meshType.pointPixelType, PixelTypes.Scalar);
  t.is(mesh.meshType.cellPixelType, PixelTypes.Scalar);
  t.is(mesh.numberOfPoints, 6);
  t.is(mesh.numberOfCells, 8);
};

test("mz3ReadMeshNode reads a MZ3 file path given on the local filesystem", async (t) => {
  const { couldRead, mesh } = await mz3ReadMeshNode(testInputFilePath);
  t.true(couldRead);
  verifyMesh(t, mesh);
});

test("mz3WriteMeshNode writes a MZ3 file path on the local filesystem", async (t) => {
  const { couldRead, mesh } = await mz3ReadMeshNode(testInputFilePath);
  t.true(couldRead);

  const useCompression = false;
  const { couldWrite } = await mz3WriteMeshNode(mesh, testOutputFilePath, {
    useCompression,
  });
  t.true(couldWrite);

  const { couldRead: couldReadBack, mesh: meshBack } = await mz3ReadMeshNode(
    testOutputFilePath
  );
  t.true(couldReadBack);
  verifyMesh(t, meshBack);
});
