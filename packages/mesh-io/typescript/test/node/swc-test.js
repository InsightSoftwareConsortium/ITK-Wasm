import test from 'ava'
import path from 'path'

import { swcReadMeshNode, swcWriteMeshNode } from '../../dist/index-node.js'
import { IntTypes, FloatTypes, PixelTypes } from 'itk-wasm'

import { testInputPath, testOutputPath } from './common.js'

const testInputFilePath = path.resolve(testInputPath, '11706c2.CNG.swc')
const testOutputFilePath = path.resolve(testOutputPath, 'swc-test-11706c2.CNG.swc')

const verifyMesh = (t, mesh) => {
  t.is(mesh.meshType.dimension, 3)
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
  t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
  t.is(mesh.meshType.pointPixelType, PixelTypes.Scalar)
  t.is(mesh.meshType.pointPixelComponents, 1)
  t.is(mesh.meshType.cellPixelType, PixelTypes.Scalar)
  t.is(mesh.numberOfPoints, 1534)
  t.is(mesh.numberOfPointPixels, 1534)
  t.is(mesh.numberOfCells, 1533)
  t.is(mesh.cellBufferSize, 6132)
}

test('swcReadMeshNode reads a SWC file path given on the local filesystem', async (t) => {
  const { couldRead, mesh } = await swcReadMeshNode(testInputFilePath)
  t.true(couldRead)
  verifyMesh(t, mesh)
})

test('swcWriteMeshNode writes a SWC file path on the local filesystem', async (t) => {
  const { couldRead, mesh } = await swcReadMeshNode(testInputFilePath)
  t.true(couldRead)

  const useCompression = false
  const { couldWrite } = await swcWriteMeshNode(mesh, testOutputFilePath, { useCompression })
  t.true(couldWrite)

  const { couldRead: couldReadBack, mesh: meshBack } = await swcReadMeshNode(testOutputFilePath)
  t.true(couldReadBack)
  verifyMesh(t, meshBack)
})
