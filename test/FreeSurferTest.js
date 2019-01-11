import test from 'ava'
import path from 'path'

const IntTypes = require(path.resolve(__dirname, '..', 'dist', 'IntTypes.js'))
const FloatTypes = require(path.resolve(__dirname, '..', 'dist', 'FloatTypes.js'))
const readMeshLocalFile = require(path.resolve(__dirname, '..', 'dist', 'readMeshLocalFile.js'))
const writeMeshLocalFile = require(path.resolve(__dirname, '..', 'dist', 'writeMeshLocalFile.js'))

const testAsciiInputFilePath = path.resolve(__dirname, '..', 'build', 'ExternalData', 'test', 'Input', 'sphere.fsa')
const testAsciiOutputFilePath = path.resolve(__dirname, '..', 'build', 'Testing', 'Temporary', 'FreeSurferTest-sphere.fsa')
const testBinaryInputFilePath = path.resolve(__dirname, '..', 'build', 'ExternalData', 'test', 'Input', 'sphere.fsb')
const testBinaryOutputFilePath = path.resolve(__dirname, '..', 'build', 'Testing', 'Temporary', 'FreeSurferTest-sphere.fsb')

const verifyMesh = (t, mesh) => {
  t.is(mesh.meshType.dimension, 3)
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
  t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
  t.is(mesh.meshType.pointPixelType, 1)
  t.is(mesh.meshType.cellPixelType, 1)
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
      return writeMeshLocalFile({ useCompression: false, binaryFileType: false }, mesh, testAsciiOutputFilePath)
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
      return writeMeshLocalFile({ useCompression: false, binaryFileType: false }, mesh, testBinaryOutputFilePath)
    })
    .then(function () {
      return readMeshLocalFile(testBinaryOutputFilePath).then(function (mesh) {
        verifyMesh(t, mesh)
      })
    })
})
