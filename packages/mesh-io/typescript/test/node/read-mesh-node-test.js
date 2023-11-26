import test from 'ava'
import path from 'path'

import { readMeshNode } from '../../dist/index-node.js'
import { IntTypes, FloatTypes, PixelTypes } from 'itk-wasm'

import { testInputPath } from './common.js'

const testFilePath = path.resolve(testInputPath, 'cow.vtk')

const verifyMesh = (t, mesh) => {
  t.is(mesh.meshType.dimension, 3)
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
  t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
  t.is(mesh.meshType.pointPixelType, PixelTypes.Scalar)
  t.is(mesh.meshType.cellPixelType, PixelTypes.Scalar)
  t.is(mesh.numberOfPoints, 2903)
  t.is(mesh.numberOfCells, 3263)
}
test('readMeshNode reads a file path given on the local filesystem', async t => {
  const mesh = await readMeshNode(testFilePath)
  verifyMesh(t, mesh)
})
