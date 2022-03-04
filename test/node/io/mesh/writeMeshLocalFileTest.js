import test from 'ava'
import path from 'path'

import { IntTypes, FloatTypes, PixelTypes, readMeshLocalFile, writeMeshLocalFile } from '../../../../dist/index.js'

const testInputFilePath = path.resolve('build', 'ExternalData', 'test', 'Input', 'cow.vtk')
const testOutputFilePath = path.resolve('build', 'Testing', 'Temporary', 'writeMeshLocalFileTest-cow.vtk')

const verifyMesh = (t, mesh) => {
  t.is(mesh.meshType.dimension, 3)
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
  t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
  t.is(mesh.meshType.pointPixelType, PixelTypes.Scalar)
  t.is(mesh.meshType.cellPixelType, PixelTypes.Scalar)
  t.is(mesh.numberOfPoints, 2903)
  t.is(mesh.numberOfCells, 3263)
}

test('writeMeshLocalFile writes a file path on the local filesystem', (t) => {
  return readMeshLocalFile(testInputFilePath)
    .then(function (mesh) {
      return writeMeshLocalFile(mesh, testOutputFilePath, { useCompression: false, binaryFileType: false })
    })
    .then(function () {
      return readMeshLocalFile(testOutputFilePath).then(function (mesh) {
        verifyMesh(t, mesh)
      })
    })
})
