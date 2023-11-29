import test from 'ava'
import path from 'path'

import { stlReadMeshNode, stlWriteMeshNode } from '../../dist/index-node.js'
import { IntTypes, FloatTypes, PixelTypes } from 'itk-wasm'

import { testInputPath, testOutputPath } from './common.js'

const testInputFilePath = path.resolve(testInputPath, 'sphere.stl')
const testOutputFilePath = path.resolve(testOutputPath, 'stl-test-sphere.stl')

const verifyMesh = (t, mesh) => {
  t.is(mesh.meshType.dimension, 3)
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
  t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
  t.is(mesh.meshType.pointPixelType, PixelTypes.Scalar)
  t.is(mesh.meshType.cellPixelType, PixelTypes.Scalar)
  t.is(mesh.numberOfPoints, 18)
  t.is(mesh.numberOfCells, 32)
}

test('stlReadMeshNode reads a STL file path given on the local filesystem', async (t) => {
  const { couldRead, mesh } = await stlReadMeshNode(testInputFilePath)
  t.true(couldRead)
  verifyMesh(t, mesh)
})

test('stlWriteMeshNode writes a STL file path on the local filesystem', async (t) => {
  const { couldRead, mesh } = await stlReadMeshNode(testInputFilePath)
  t.true(couldRead)

  const useCompression = false
  const { couldWrite } = await stlWriteMeshNode(mesh, testOutputFilePath, { useCompression })
  t.true(couldWrite)

  const { couldRead: couldReadBack, mesh: meshBack } = await stlReadMeshNode(testOutputFilePath)
  t.true(couldReadBack)
  verifyMesh(t, meshBack)
})
