import test from 'ava'
import path from 'path'

import { readPointSetNode, writePointSetNode } from '../../dist/index-node.js'
import { IntTypes, FloatTypes, PixelTypes } from 'itk-wasm'

import { testInputPath, testOutputPath } from './common.js'

const testInputFilePath = path.resolve(testInputPath, "box-points.obj");
const testOutputFilePath = path.resolve(
  testOutputPath,
  "write-point-set-test-box.obj",
);

const verifyPointSet = (t, pointSet) => {
  t.is(pointSet.pointSetType.dimension, 3);
  t.is(pointSet.pointSetType.pointComponentType, FloatTypes.Float32);
  t.is(pointSet.pointSetType.pointPixelType, PixelTypes.Vector);
  t.is(pointSet.numberOfPoints, 8);
  t.is(pointSet.numberOfPointPixels, 0);
};

test('writePointSetNode writes a file path on the local filesystem', async (t) => {
  const pointSet = await readPointSetNode(testInputFilePath)
  verifyPointSet(t, pointSet)

  const useCompression = false
  const binaryFileType = false
  await writePointSetNode(pointSet, testOutputFilePath, { useCompression, binaryFileType })

  const pointSetBack = await readPointSetNode(testOutputFilePath)
  verifyPointSet(t, pointSetBack)
})
