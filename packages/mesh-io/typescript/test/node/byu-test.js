import test from 'ava'
import path from 'path'

import { byuReadMeshNode, byuWriteMeshNode } from '../../dist/index-node.js'
import { IntTypes, FloatTypes, PixelTypes } from 'itk-wasm'

import { testInputPath, testOutputPath } from './common.js'

const testInputFilePath = path.resolve(testInputPath, 'cube.byu')
const testOutputFilePath = path.resolve(testOutputPath, 'byu-test-cube.byu')

const verifyMesh = (t, mesh) => {
  t.is(mesh.meshType.dimension, 3)
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float64)
  t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
  t.is(mesh.meshType.pointPixelType, PixelTypes.Scalar)
  t.is(mesh.meshType.cellPixelType, PixelTypes.Scalar)
  t.is(mesh.numberOfPoints, 8)
  t.is(mesh.numberOfCells, 6)
}

test('byuReadMeshNode reads a BYU file path given on the local filesystem', async (t) => {
  const { couldRead, mesh } = await byuReadMeshNode(testInputFilePath)
  t.true(couldRead)
  verifyMesh(t, mesh)
})

test('byuWriteMeshNode writes a BYU file path on the local filesystem', async (t) => {
  const { couldRead, mesh } = await byuReadMeshNode(testInputFilePath)
  t.true(couldRead)

  const useCompression = false
  const { couldWrite } = await byuWriteMeshNode(mesh, testOutputFilePath, { useCompression })
  t.true(couldWrite)

  const { couldRead: couldReadBack, mesh: meshBack } = await byuReadMeshNode(testOutputFilePath)
  t.true(couldReadBack)
  verifyMesh(t, meshBack)
})
