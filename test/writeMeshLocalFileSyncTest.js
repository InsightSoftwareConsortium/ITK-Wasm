const test = require('ava')
const path = require('path')

const IntTypes = require(path.resolve(__dirname, '..', 'dist', 'IntTypes.js'))
const FloatTypes = require(path.resolve(__dirname, '..', 'dist', 'FloatTypes.js'))
const readMeshLocalFileSync = require(path.resolve(__dirname, '..', 'dist', 'readMeshLocalFileSync.js'))
const writeMeshLocalFileSync = require(path.resolve(__dirname, '..', 'dist', 'writeMeshLocalFileSync.js'))

const testInputFilePath = path.resolve(__dirname, '..', 'build', 'ExternalData', 'test', 'Input', 'cow.vtk')
const testOutputFilePath = path.resolve(__dirname, '..', 'build', 'Testing', 'Temporary', 'writeMeshLocalFileSyncTest-cow.vtk')

const verifyMesh = (t, mesh) => {
  t.is(mesh.meshType.dimension, 3)
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
  t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
  t.is(mesh.meshType.pointPixelType, 1)
  t.is(mesh.meshType.cellPixelType, 1)
  t.is(mesh.numberOfPoints, 2903)
  t.is(mesh.numberOfCells, 3263)
}

test('writeMeshLocalFileSync writes a file path on the local filesystem', (t) => {
  const mesh = readMeshLocalFileSync(testInputFilePath)
  writeMeshLocalFileSync({ useCompression: false, binaryFileType: false }, mesh, testOutputFilePath)
  const readMesh = readMeshLocalFileSync(testOutputFilePath)
  verifyMesh(t, readMesh)
})
