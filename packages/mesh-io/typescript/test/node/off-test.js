import test from 'ava'
import path from 'path'

import { offReadMeshNode, offWriteMeshNode } from '../../dist/index-node.js'
import { IntTypes, FloatTypes, PixelTypes } from 'itk-wasm'

import { testInputPath, testOutputPath } from './common.js'

const testInputFilePath = path.resolve(testInputPath, 'octa.off')
const testOutputFilePath = path.resolve(testOutputPath, 'off-test-octa.off')

const verifyMesh = (t, mesh) => {
  t.is(mesh.meshType.dimension, 3)
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
  t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
  t.is(mesh.meshType.pointPixelType, PixelTypes.Scalar)
  t.is(mesh.meshType.cellPixelType, PixelTypes.Scalar)
  t.is(mesh.numberOfPoints, 6)
  t.is(mesh.numberOfCells, 8)
}

test('offReadMeshNode reads a OFF file path given on the local filesystem', async (t) => {
  const { couldRead, mesh } = await offReadMeshNode(testInputFilePath)
  t.true(couldRead)
  verifyMesh(t, mesh)
})

test('offWriteMeshNode writes a OFF file path on the local filesystem', async (t) => {
  const { couldRead, mesh } = await offReadMeshNode(testInputFilePath)
  t.true(couldRead)

  const useCompression = false
  const { couldWrite } = await offWriteMeshNode(mesh, testOutputFilePath, { useCompression })
  t.true(couldWrite)

  const { couldRead: couldReadBack, mesh: meshBack } = await offReadMeshNode(testOutputFilePath)
  t.true(couldReadBack)
  verifyMesh(t, meshBack)
})
