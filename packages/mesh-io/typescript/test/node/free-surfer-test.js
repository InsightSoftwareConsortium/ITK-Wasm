import test from 'ava'
import path from 'path'

import { freeSurferAsciiReadMeshNode, freeSurferAsciiWriteMeshNode, freeSurferBinaryReadMeshNode, freeSurferBinaryWriteMeshNode } from '../../dist/index-node.js'
import { IntTypes, FloatTypes, PixelTypes } from 'itk-wasm'

import { testInputPath, testOutputPath } from './common.js'


const testAsciiInputFilePath = path.resolve(testInputPath, 'sphere.fsa')
const testAsciiOutputFilePath = path.resolve(testOutputPath, 'free-surfer-test-sphere.fsa')
const testBinaryInputFilePath = path.resolve(testInputPath, 'sphere.fsb')
const testBinaryOutputFilePath = path.resolve(testOutputPath, 'free-surfer-test-sphere.fsb')

const verifyMesh = (t, mesh) => {
  t.is(mesh.meshType.dimension, 3)
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
  t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
  t.is(mesh.meshType.pointPixelType, PixelTypes.Scalar)
  t.is(mesh.meshType.cellPixelType, PixelTypes.Scalar)
  t.is(mesh.numberOfPoints, 162)
  t.is(mesh.numberOfCells, 320)
}

test('freeSurferAsciiReadMeshNode reads a FreeSurfer Ascii file path given on the local filesystem', async t => {
  const { couldRead, mesh } = await freeSurferAsciiReadMeshNode(testAsciiInputFilePath)
  t.true(couldRead)
  verifyMesh(t, mesh)
})

test('freeSurferAsciiWriteMeshNode writes a FreeSurfer Ascii file path on the local filesystem', async t => {
  const { couldRead, mesh } = await freeSurferAsciiReadMeshNode(testAsciiInputFilePath)
  t.true(couldRead)

  const useCompression = false
  const { couldWrite } = await freeSurferAsciiWriteMeshNode(mesh, testAsciiOutputFilePath, { useCompression })
  t.true(couldWrite)

  const { couldRead: couldReadBack, mesh: meshBack } = await freeSurferAsciiReadMeshNode(testAsciiOutputFilePath)
  t.true(couldReadBack)
  verifyMesh(t, meshBack)
})

test('freeSurferBinaryReadMeshNode reads a FreeSurfer Binary file path given on the local filesystem', async t => {
  const { couldRead, mesh } = await freeSurferBinaryReadMeshNode(testBinaryInputFilePath)
  t.true(couldRead)
  verifyMesh(t, mesh)
})

test('freeSurferBinaryWriteMeshNode writes a FreeSurfer Binary file path on the local filesystem', async t => {
  const { couldRead, mesh } = await freeSurferBinaryReadMeshNode(testBinaryInputFilePath)
  t.true(couldRead)

  const useCompression = false
  const { couldWrite } = await freeSurferBinaryWriteMeshNode(mesh, testBinaryOutputFilePath, { useCompression })
  t.true(couldWrite)

  const { couldRead: couldReadBack, mesh: meshBack } = await freeSurferBinaryReadMeshNode(testBinaryOutputFilePath)
  t.true(couldReadBack)
  verifyMesh(t, meshBack)
})
