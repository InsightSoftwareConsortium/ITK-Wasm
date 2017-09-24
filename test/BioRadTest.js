import test from 'ava'
import path from 'path'

const IntTypes = require(path.resolve(__dirname, '..', 'dist', 'IntTypes.js'))
const PixelTypes = require(path.resolve(__dirname, '..', 'dist', 'PixelTypes.js'))
const readImageLocalFile = require(path.resolve(__dirname, '..', 'dist', 'readImageLocalFile.js'))
const writeImageLocalFile = require(path.resolve(__dirname, '..', 'dist', 'writeImageLocalFile.js'))

const testInputFilePath = path.resolve(__dirname, '..', 'build', 'ExternalData', 'test', 'Input', 'biorad.pic')
const testOutputFilePath = path.resolve(__dirname, '..', 'build', 'Testing', 'Temporary', 'TestBioRad-biorad.pic')

const verifyImage = (t, image) => {
  t.is(image.imageType.dimension, 2, 'dimension')
  t.is(image.imageType.componentType, IntTypes.UInt8, 'componentType')
  t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
  t.is(image.imageType.components, 1, 'components')
  t.is(image.origin[0], 0.0, 'origin[0]')
  t.is(image.origin[1], 0.0, 'origin[1]')
  t.is(image.spacing[0], 0.06000000238418579, 'spacing[0]')
  t.is(image.spacing[1], 0.06000000238418579, 'spacing[1]')
  t.is(image.direction.getElement(0, 0), 1.0, 'direction (0, 0)')
  t.is(image.direction.getElement(0, 1), 0.0, 'direction (0, 1)')
  t.is(image.direction.getElement(1, 0), 0.0, 'direction (1, 0)')
  t.is(image.direction.getElement(1, 1), 1.0, 'direction (1, 1)')
  t.is(image.size[0], 768, 'size[0]')
  t.is(image.size[1], 512, 'size[1]')
  t.is(image.buffer.length, 393216, 'buffer.length')
  t.is(image.buffer[1000], 27, 'buffer[1000]')
}

test('Test reading a BioRad file', t => {
  return readImageLocalFile(testInputFilePath).then(function (image) {
    verifyImage(t, image)
  })
})

test('Test writing a BioRad file', t => {
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
