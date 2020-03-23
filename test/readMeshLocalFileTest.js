const test = require('ava')
const path = require('path')

const IntTypes = require(path.resolve(__dirname, '..', 'dist', 'IntTypes.js'))
const FloatTypes = require(path.resolve(__dirname, '..', 'dist', 'FloatTypes.js'))
const readMeshLocalFile = require(path.resolve(__dirname, '..', 'dist', 'readMeshLocalFile.js'))

const testFilePath = path.resolve(__dirname, '..', 'build', 'ExternalData', 'test', 'Input', 'cow.vtk')

test('readMeshLocalFile reads a file path given on the local filesystem', t => {
  return readMeshLocalFile(testFilePath).then(function (mesh) {
    t.is(mesh.meshType.dimension, 3)
    t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
    t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
    t.is(mesh.meshType.pointPixelType, 1)
    t.is(mesh.meshType.cellPixelType, 1)
    t.is(mesh.numberOfPoints, 2903)
    t.is(mesh.numberOfCells, 3263)
  })
})
