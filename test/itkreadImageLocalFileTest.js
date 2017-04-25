import test from 'ava'
import path from 'path'

const IntTypes = require(path.resolve(__dirname, '..', 'dist', 'itkIntTypes.js'))
const PixelTypes = require(path.resolve(__dirname, '..', 'dist', 'itkPixelTypes.js'))
const readImageLocalFile = require(path.resolve(__dirname, '..', 'dist', 'itkreadImageLocalFile.js'))
const itkConfig = require(path.resolve(__dirname, '..', 'dist', 'itkConfig.js'))
itkConfig.imageIOsURL = path.resolve(__dirname, '..', 'dist', 'ImageIOs')

const testFilePath = path.resolve(__dirname, '..', 'build', 'ExternalData', 'test', 'Input', 'cthead1.png')

test('readImageLocalFile reads a file path given on the local filesystem', t => {
  return readImageLocalFile(testFilePath).then(function (image) {
    t.is(image.imageType.dimension, 2)
    t.is(image.imageType.componentType, IntTypes.UInt8)
    t.is(image.imageType.pixelType, PixelTypes.RGB)
    t.is(image.imageType.components, 3)
    t.is(image.origin[0], 0.0)
    t.is(image.origin[1], 0.0)
    t.is(image.spacing[0], 1.0)
    t.is(image.spacing[1], 1.0)
    t.is(image.direction.getElement(0, 0), 1.0)
    t.is(image.direction.getElement(0, 1), 0.0)
    t.is(image.direction.getElement(1, 0), 0.0)
    t.is(image.direction.getElement(1, 1), 1.0)
    t.is(image.size[0], 256)
    t.is(image.size[1], 256)
    t.is(image.buffer.length, 196608)
  })
})
