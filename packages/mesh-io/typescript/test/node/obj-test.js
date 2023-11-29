import test from 'ava'
import path from 'path'

import { objReadMeshNode, objWriteMeshNode } from '../../dist/index-node.js'
import { IntTypes, FloatTypes, PixelTypes } from 'itk-wasm'

import { testInputPath, testOutputPath } from './common.js'

const testInputFilePath = path.resolve(testInputPath, 'box.obj')
const testOutputFilePath = path.resolve(testOutputPath, 'obj-test-box.obj')

const verifyMesh = (t, mesh) => {
  t.is(mesh.meshType.dimension, 3)
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
  t.is(mesh.meshType.cellComponentType, IntTypes.Int64)
  t.is(mesh.meshType.pointPixelType, PixelTypes.Vector)
  t.is(mesh.meshType.cellPixelType, PixelTypes.Vector)
  t.is(mesh.numberOfPoints, 8)
  t.is(mesh.numberOfCells, 6)
}

test('objReadMeshNode reads a OBJ file path given on the local filesystem', async (t) => {
  const { couldRead, mesh } = await objReadMeshNode(testInputFilePath)
  t.true(couldRead)
  verifyMesh(t, mesh)
})

test('objWriteMeshNode writes a OBJ file path on the local filesystem', async (t) => {
  const { couldRead, mesh } = await objReadMeshNode(testInputFilePath)
  t.true(couldRead)

  const useCompression = false
  const { couldWrite } = await objWriteMeshNode(mesh, testOutputFilePath, { useCompression })
  t.true(couldWrite)

  const { couldRead: couldReadBack, mesh: meshBack } = await objReadMeshNode(testOutputFilePath)
  t.true(couldReadBack)
  verifyMesh(t, meshBack)
})
