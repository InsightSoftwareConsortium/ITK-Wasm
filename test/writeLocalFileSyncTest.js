import test from 'ava'
import path from 'path'

const IntTypes = require(path.resolve(__dirname, '..', 'dist', 'IntTypes.js'))
const FloatTypes = require(path.resolve(__dirname, '..', 'dist', 'FloatTypes.js'))
const PixelTypes = require(path.resolve(__dirname, '..', 'dist', 'PixelTypes.js'))
const readImageLocalFile = require(path.resolve(__dirname, '..', 'dist', 'readImageLocalFile.js'))
const readMeshLocalFile = require(path.resolve(__dirname, '..', 'dist', 'readMeshLocalFile.js'))
const writeLocalFileSync = require(path.resolve(__dirname, '..', 'dist', 'writeLocalFileSync.js'))

const testImageInputFilePath = path.resolve(__dirname, '..', 'build', 'ExternalData', 'test', 'Input', 'cthead1.png')
const testImageOutputFilePath = path.resolve(__dirname, '..', 'build', 'Testing', 'Temporary', 'writeLocalFileSyncTest-cthead1.png')
const testMeshInputFilePath = path.resolve(__dirname, '..', 'build', 'ExternalData', 'test', 'Input', 'cow.vtk')
const testMeshOutputFilePath = path.resolve(__dirname, '..', 'build', 'Testing', 'Temporary', 'writeLocalFileSyncTest-cow.vtk')

const verifyImage = (t, image) => {
  t.is(image.imageType.dimension, 2, 'dimension')
  t.is(image.imageType.componentType, IntTypes.UInt8, 'componentType')
  t.is(image.imageType.pixelType, PixelTypes.RGB, 'pixelType')
  t.is(image.imageType.components, 3, 'components')
  t.is(image.origin[0], 0.0, 'origin[0]')
  t.is(image.origin[1], 0.0, 'origin[1]')
  t.is(image.spacing[0], 1.0, 'spacing[0]')
  t.is(image.spacing[1], 1.0, 'spacing[1]')
  t.is(image.direction.getElement(0, 0), 1.0, 'direction (0, 0)')
  t.is(image.direction.getElement(0, 1), 0.0, 'direction (0, 1)')
  t.is(image.direction.getElement(1, 0), 0.0, 'direction (1, 0)')
  t.is(image.direction.getElement(1, 1), 1.0, 'direction (1, 1)')
  t.is(image.size[0], 256, 'size[0]')
  t.is(image.size[1], 256, 'size[1]')
  t.is(image.data.length, 196608, 'data.length')
}

test('writeLocalFileSync writes an image file path on the local filesystem', t => {
  return readImageLocalFile(testImageInputFilePath)
    .then(function (image) {
      const useCompression = false
      writeLocalFileSync(useCompression, image, testImageOutputFilePath)
      return readImageLocalFile(testImageOutputFilePath).then(function (image) {
        verifyImage(t, image)
      })
    })
})

const verifyMesh = (t, mesh) => {
  t.is(mesh.meshType.dimension, 3)
  t.is(mesh.meshType.pointComponentType, FloatTypes.Float32)
  t.is(mesh.meshType.cellComponentType, IntTypes.UInt32)
  t.is(mesh.meshType.pointPixelType, 1)
  t.is(mesh.meshType.cellPixelType, 1)
  t.is(mesh.numberOfPoints, 2903)
  t.is(mesh.numberOfCells, 3263)
}

test('writeLocalFile writes a mesh file path on the local filesystem', (t) => {
  return readMeshLocalFile(testMeshInputFilePath)
    .then(function (mesh) {
      writeLocalFileSync(false, mesh, testMeshOutputFilePath)
      return readMeshLocalFile(testMeshOutputFilePath).then(function (mesh) {
        verifyMesh(t, mesh)
      })
    })
})
