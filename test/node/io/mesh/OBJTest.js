import test from 'ava'
import path from 'path'

import { IntTypes, FloatTypes, PixelTypes, readMeshLocalFile, writeMeshLocalFile } from '../../../../dist/index.js'

const testInputFilePath = path.resolve('build-emscripten', 'ExternalData', 'test', 'Input', 'box.obj')
const testOutputFilePath = path.resolve('build-emscripten', 'Testing', 'Temporary', 'OBJTest-box.obj')

const verifyMesh = (t, mesh) => {
  t.is(mesh.meshType.dimension, 3)
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
  t.is(mesh.meshType.cellComponentType, IntTypes.Int64)
  t.is(mesh.meshType.pointPixelType, PixelTypes.Vector)
  t.is(mesh.meshType.cellPixelType, PixelTypes.Vector)
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
      return writeMeshLocalFile(mesh, testOutputFilePath)
    })
    .then(function () {
      return readMeshLocalFile(testOutputFilePath).then(function (mesh) {
        verifyMesh(t, mesh)
      })
    })
})
