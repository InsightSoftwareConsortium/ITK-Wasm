const path = require('path')
const assert = require('chai').assert

const IntTypes = require(path.resolve(__dirname, '..', 'dist', 'itkIntTypes.js'))
const PixelTypes = require(path.resolve(__dirname, '..', 'dist', 'itkPixelTypes.js'))
const readImageLocalFile = require(path.resolve(__dirname, '..', 'dist', 'itkreadImageLocalFile.js'))

const testFilePath = path.resolve(__dirname, '..', 'build', 'ExternalData', 'test', 'Input', 'cthead1.png')

describe('readImageLocalFile', function () {
  it('reads a file path given on the local filesystem', function () {
    return readImageLocalFile(testFilePath).then(function (image) {
      assert.strictEqual(image.imageType.dimension, 2)
      assert.strictEqual(image.imageType.componentType, IntTypes.UInt8)
      assert.strictEqual(image.imageType.pixelType, PixelTypes.RGB)
      assert.strictEqual(image.imageType.components, 3)
      assert.strictEqual(image.origin[0], 0.0)
      assert.strictEqual(image.origin[1], 0.0)
      assert.strictEqual(image.spacing[0], 1.0)
      assert.strictEqual(image.spacing[1], 1.0)
      assert.strictEqual(image.direction.getElement(0, 0), 1.0)
      assert.strictEqual(image.direction.getElement(0, 1), 0.0)
      assert.strictEqual(image.direction.getElement(1, 0), 0.0)
      assert.strictEqual(image.direction.getElement(1, 1), 1.0)
      assert.strictEqual(image.size[0], 256)
      assert.strictEqual(image.size[1], 256)
      assert.strictEqual(image.buffer.length, 196608)
    })
  })
})
