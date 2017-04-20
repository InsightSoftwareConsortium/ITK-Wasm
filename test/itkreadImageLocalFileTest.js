const path = require('path')
const assert = require('chai').assert

const itk = require(path.resolve(__dirname, '..', 'dist', 'itk.js'))

const testFilePath = path.resolve(__dirname, '..', 'build', 'ExternalData', 'test', 'Input', 'cthead1.png')

describe('readImageLocalFile', function () {
  it('reads a file path given on the local filesystem', function () {
    const defaultImageType = new itk.ImageType()
    return itk.readImageLocalFile(defaultImageType, testFilePath).then(function (image) {
      console.log(image)
      assert.strictEqual(image.imageType.dimension, 2)
      assert.strictEqual(image.imageType.pixelType, itk.UInt8)
    })
  })

  it('dynamically determines the image type when null', function () {
    const imageType = null
    return itk.readImageLocalFile(imageType, testFilePath).then(function (image) {
      console.log(image)
      assert.strictEqual(image.imageType.dimension, 2)
      assert.strictEqual(image.imageType.pixelType, itk.UInt8)
    })
  })
})
