import test from 'ava'
import path from 'path'

import { IntTypes, FloatTypes, PixelTypes, getMatrixElement, readImageLocalFile, readMeshLocalFile, writeLocalFile } from '../../../../dist/index.js'

const testImageInputFilePath = path.resolve('build-emscripten', 'ExternalData', 'test', 'Input', 'cthead1.png')
const testImageOutputFilePath = path.resolve('build-emscripten', 'Testing', 'Temporary', 'writeLocalFileTest-cthead1.png')
const testMeshInputFilePath = path.resolve('build-emscripten', 'ExternalData', 'test', 'Input', 'cow.vtk')
const testMeshOutputFilePath = path.resolve('build-emscripten', 'Testing', 'Temporary', 'writeLocalFileTest-cow.vtk')

const verifyImage = (t, image) => {
  t.is(image.imageType.dimension, 2, 'dimension')
  t.is(image.imageType.componentType, IntTypes.UInt8, 'componentType')
  t.is(image.imageType.pixelType, PixelTypes.RGB, 'pixelType')
  t.is(image.imageType.components, 3, 'components')
  t.is(image.origin[0], 0.0, 'origin[0]')
  t.is(image.origin[1], 0.0, 'origin[1]')
  t.is(image.spacing[0], 1.0, 'spacing[0]')
  t.is(image.spacing[1], 1.0, 'spacing[1]')
  t.is(getMatrixElement(image.direction, 2, 0, 0), 1.0, 'direction (0, 0)')
  t.is(getMatrixElement(image.direction, 2, 0, 1), 0.0, 'direction (0, 1)')
  t.is(getMatrixElement(image.direction, 2, 1, 0), 0.0, 'direction (1, 0)')
  t.is(getMatrixElement(image.direction, 2, 1, 1), 1.0, 'direction (1, 1)')
  t.is(image.size[0], 256, 'size[0]')
  t.is(image.size[1], 256, 'size[1]')
  t.is(image.data.length, 196608, 'data.length')
}

test('writeLocalFile writes an image file path on the local filesystem', t => {
  return readImageLocalFile(testImageInputFilePath)
    .then(function (image) {
      const useCompression = false
      return writeLocalFile(useCompression, image, testImageOutputFilePath)
    })
    .then(function () {
      return readImageLocalFile(testImageOutputFilePath).then(function (image) {
        verifyImage(t, image)
      })
    })
})

const verifyMesh = (t, mesh) => {
  t.is(mesh.meshType.dimension, 3)
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
  t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
  t.is(mesh.meshType.pointPixelType, PixelTypes.Scalar)
  t.is(mesh.meshType.cellPixelType, PixelTypes.Scalar)
  t.is(mesh.numberOfPoints, 2903)
  t.is(mesh.numberOfCells, 3263)
}

test('writeLocalFile writes a mesh file path on the local filesystem', (t) => {
  return readMeshLocalFile(testMeshInputFilePath)
    .then(function (mesh) {
      return writeLocalFile(false, mesh, testMeshOutputFilePath)
    })
    .then(function () {
      return readMeshLocalFile(testMeshOutputFilePath).then(function (mesh) {
        verifyMesh(t, mesh)
      })
    })
})
