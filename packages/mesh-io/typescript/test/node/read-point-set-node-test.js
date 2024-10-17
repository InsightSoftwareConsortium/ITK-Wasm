import test from 'ava'
import path from 'path'

import { readPointSetNode } from '../../dist/index-node.js'
import { FloatTypes, PixelTypes } from 'itk-wasm'

import { testInputPath } from './common.js'

const testFilePath = path.resolve(testInputPath, "box-points.obj");

const verifyPointSet = (t, pointSet) => {
  t.is(pointSet.pointSetType.dimension, 3);
  t.is(pointSet.pointSetType.pointComponentType, FloatTypes.Float32);
  t.is(pointSet.pointSetType.pointPixelType, PixelTypes.Vector);
  t.is(pointSet.numberOfPoints, 8);
  t.is(pointSet.numberOfPointPixels, 0);
};

test('readPointSetNode reads a file path given on the local filesystem', async t => {
  const pointSet = await readPointSetNode(testFilePath)
  verifyPointSet(t, pointSet)
})
