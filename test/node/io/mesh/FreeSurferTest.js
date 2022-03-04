import test from 'ava'
import path from 'path'

import { IntTypes, FloatTypes, PixelTypes, readMeshLocalFile, writeMeshLocalFile } from '../../../../dist/index.js'

const testAsciiInputFilePath = path.resolve('build', 'ExternalData', 'test', 'Input', 'sphere.fsa')
const testAsciiOutputFilePath = path.resolve('build', 'Testing', 'Temporary', 'FreeSurferTest-sphere.fsa')
const testBinaryInputFilePath = path.resolve('build', 'ExternalData', 'test', 'Input', 'sphere.fsb')
const testBinaryOutputFilePath = path.resolve('build', 'Testing', 'Temporary', 'FreeSurferTest-sphere.fsb')

const verifyMesh = (t, mesh) => {
  t.is(mesh.meshType.dimension, 3)
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
  t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
  t.is(mesh.meshType.pointPixelType, PixelTypes.Scalar)
  t.is(mesh.meshType.cellPixelType, PixelTypes.Scalar)
  t.is(mesh.numberOfPoints, 162)
  t.is(mesh.numberOfCells, 320)
}

test('readMeshLocalFile reads a FreeSurfer Ascii file path given on the local filesystem', t => {
  return readMeshLocalFile(testAsciiInputFilePath).then(function (mesh) {
    verifyMesh(t, mesh)
  })
})

test('writeMeshLocalFile writes a FreeSurfer Ascii file path on the local filesystem', (t) => {
  return readMeshLocalFile(testAsciiInputFilePath)
    .then(function (mesh) {
      return writeMeshLocalFile(mesh, testAsciiOutputFilePath)
    })
    .then(function () {
      return readMeshLocalFile(testAsciiOutputFilePath).then(function (mesh) {
        verifyMesh(t, mesh)
      })
    })
})

test('readMeshLocalFile reads a FreeSurfer Binary file path given on the local filesystem', t => {
  return readMeshLocalFile(testBinaryInputFilePath).then(function (mesh) {
    verifyMesh(t, mesh)
  })
})

test('writeMeshLocalFile writes a FreeSurfer Binary file path on the local filesystem', (t) => {
  return readMeshLocalFile(testBinaryInputFilePath)
    .then(function (mesh) {
      return writeMeshLocalFile(mesh, testBinaryOutputFilePath)
    })
    .then(function () {
      return readMeshLocalFile(testBinaryOutputFilePath).then(function (mesh) {
        verifyMesh(t, mesh)
      })
    })
})
