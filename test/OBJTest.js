const test = require('ava')
const path = require('path')

const IntTypes = require(path.resolve(__dirname, '..', 'dist', 'IntTypes.js'))
const FloatTypes = require(path.resolve(__dirname, '..', 'dist', 'FloatTypes.js'))
const readMeshLocalFile = require(path.resolve(__dirname, '..', 'dist', 'readMeshLocalFile.js'))
const writeMeshLocalFile = require(path.resolve(__dirname, '..', 'dist', 'writeMeshLocalFile.js'))

const testInputFilePath = path.resolve(__dirname, '..', 'build', 'ExternalData', 'test', 'Input', 'box.obj')
const testOutputFilePath = path.resolve(__dirname, '..', 'build', 'Testing', 'Temporary', 'OBJTest-box.obj')

const verifyMesh = (t, mesh) => {
  t.is(mesh.meshType.dimension, 3)
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
  t.is(mesh.meshType.cellComponentType, IntTypes.Int32)
  t.is(mesh.meshType.pointPixelType, 5)
  t.is(mesh.meshType.cellPixelType, 5)
  t.is(mesh.numberOfPoints, 8)
  t.is(mesh.numberOfCells, 6)
}

test('readMeshLocalFile reads a OBJ file path given on the local filesystem', t => {
  return readMeshLocalFile(testInputFilePath).then(function (mesh) {
    verifyMesh(t, mesh)
  })
})

test('writeMeshLocalFile writes a OBJ file path on the local filesystem', (t) => {
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
