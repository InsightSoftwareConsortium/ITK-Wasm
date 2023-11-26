import test from 'ava'
import path from 'path'

import { readMeshNode, writeMeshNode } from '../../dist/index-node.js'
import { IntTypes, FloatTypes, PixelTypes } from 'itk-wasm'

import { testInputPath, testOutputPath } from './common.js'

const testInputFilePath = path.resolve(testInputPath, 'cow.vtk')
const testOutputFilePath = path.resolve(testOutputPath, 'write-mesh-node-test-cow.vtk')

const verifyMesh = (t, mesh) => {
  t.is(mesh.meshType.dimension, 3)
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
  t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
  t.is(mesh.meshType.pointPixelType, PixelTypes.Scalar)
  t.is(mesh.meshType.cellPixelType, PixelTypes.Scalar)
  t.is(mesh.numberOfPoints, 2903)
  t.is(mesh.numberOfCells, 3263)
}

test('writeMeshNode writes a file path on the local filesystem', async (t) => {
  const mesh = await readMeshNode(testInputFilePath)
  verifyMesh(t, mesh)

  const useCompression = false
  const binaryFileType = false
  await writeMeshNode(mesh, testOutputFilePath, { useCompression, binaryFileType })

  const meshBack = await readMeshNode(testOutputFilePath)
  verifyMesh(t, meshBack)
})
