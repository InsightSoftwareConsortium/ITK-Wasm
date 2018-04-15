import test from 'ava'
import path from 'path'

const IntTypes = require(path.resolve(__dirname, '..', 'dist', 'IntTypes.js'))
const PixelTypes = require(path.resolve(__dirname, '..', 'dist', 'PixelTypes.js'))
const readImageLocalFile = require(path.resolve(__dirname, '..', 'dist', 'readImageLocalFile.js'))
const writeImageLocalFile = require(path.resolve(__dirname, '..', 'dist', 'writeImageLocalFile.js'))

const testInputFilePath = path.resolve(__dirname, '..', 'build', 'ExternalData', 'test', 'Input', 'T1.mgz')
const testOutputFilePath = path.resolve(__dirname, '..', 'build', 'Testing', 'Temporary', 'MGHTest-T1.mgz')

const verifyImage = (t, image) => {
  t.is(image.imageType.dimension, 3, 'dimension')
  t.is(image.imageType.componentType, IntTypes.UInt8, 'componentType')
  t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
  t.is(image.imageType.components, 1, 'components')
  t.is(image.origin[0], -127.16149944067001, 'origin[0]')
  t.is(image.origin[1], 148.39564514160156, 'origin[1]')
  t.is(image.origin[2], 139.0726842880249, 'origin[2]')
  t.is(image.spacing[0], 1.0, 'spacing[0]')
  t.is(image.spacing[1], 1.0, 'spacing[1]')
  t.is(image.spacing[2], 1.0, 'spacing[2]')
  t.is(image.direction.getElement(0, 0), 1.0, 'direction (0, 0)')
  t.is(image.direction.getElement(0, 1), 0.0, 'direction (0, 1)')
  t.is(image.direction.getElement(0, 2), 0.0, 'direction (0, 2)')
  t.is(image.direction.getElement(1, 0), 0.0, 'direction (1, 0)')
  t.is(image.direction.getElement(1, 1), 0.0, 'direction (1, 1)')
  t.is(image.direction.getElement(1, 2), -1.0, 'direction (1, 2)')
  t.is(image.direction.getElement(2, 0), 0.0, 'direction (2, 0)')
  t.is(image.direction.getElement(2, 1), -1.0, 'direction (2, 1)')
  t.is(image.direction.getElement(2, 2), 0.0, 'direction (2, 2)')
  t.is(image.size[0], 256, 'size[0]')
  t.is(image.size[1], 256, 'size[1]')
  t.is(image.size[2], 256, 'size[2]')
  t.is(image.data.length, 16777216, 'data.length')
  t.is(image.data[1000], 0, 'data[1000]')
}

test('Test reading a MGH file', t => {
  return readImageLocalFile(testInputFilePath).then(function (image) {
    verifyImage(t, image)
  })
})

test('Test writing a MGH file', t => {
  return readImageLocalFile(testInputFilePath).then(function (image) {
    const useCompression = false
    return writeImageLocalFile(useCompression, image, testOutputFilePath)
  })
    .then(function () {
      return readImageLocalFile(testOutputFilePath).then(function (image) {
        verifyImage(t, image)
      })
    })
})
