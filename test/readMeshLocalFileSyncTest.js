import test from 'ava'
import path from 'path'

const IntTypes = require(path.resolve(__dirname, '..', 'dist', 'IntTypes.js'))
const FloatTypes = require(path.resolve(__dirname, '..', 'dist', 'FloatTypes.js'))
const readMeshLocalFileSync = require(path.resolve(__dirname, '..', 'dist', 'readMeshLocalFileSync.js'))

const testFilePath = path.resolve(__dirname, '..', 'build', 'ExternalData', 'test', 'Input', 'cow.vtk')

test('readMeshLocalFileSync reads a file path given on the local filesystem', (t) => {
  const mesh = readMeshLocalFileSync(testFilePath)
  t.is(mesh.meshType.dimension, 3)
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
  t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
  t.is(mesh.meshType.pointPixelType, 1)
  t.is(mesh.meshType.cellPixelType, 1)
  t.is(mesh.numberOfPoints, 2903)
  t.is(mesh.numberOfCells, 3263)
})
