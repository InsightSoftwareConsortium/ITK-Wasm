const test = require('ava')
const path = require('path')

const IntTypes = require(path.resolve(__dirname, '..', 'dist', 'IntTypes.js'))
const FloatTypes = require(path.resolve(__dirname, '..', 'dist', 'FloatTypes.js'))
const readMeshLocalFile = require(path.resolve(__dirname, '..', 'dist', 'readMeshLocalFile.js'))
const writeMeshLocalFile = require(path.resolve(__dirname, '..', 'dist', 'writeMeshLocalFile.js'))

const testInputFilePath = path.resolve(__dirname, '..', 'build', 'ExternalData', 'test', 'Input', 'octa.off')
const testOutputFilePath = path.resolve(__dirname, '..', 'build', 'Testing', 'Temporary', 'OFFTest-octa.off')

const verifyMesh = (t, mesh) => {
  t.is(mesh.meshType.dimension, 3)
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
  t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
  t.is(mesh.meshType.pointPixelType, 1)
  t.is(mesh.meshType.cellPixelType, 1)
  t.is(mesh.numberOfPoints, 6)
  t.is(mesh.numberOfCells, 8)
}

test('readMeshLocalFile reads a OFF file path given on the local filesystem', t => {
  return readMeshLocalFile(testInputFilePath).then(function (mesh) {
    verifyMesh(t, mesh)
  })
})

test('writeMeshLocalFile writes a OFF file path on the local filesystem', (t) => {
  return readMeshLocalFile(testInputFilePath)
    .then(function (mesh) {
      return writeMeshLocalFile({ useCompression: false, binaryFileType: false }, mesh, testOutputFilePath)
    })
    .then(function () {
      return readMeshLocalFile(testOutputFilePath).then(function (mesh) {
        verifyMesh(t, mesh)
      })
    })
})
