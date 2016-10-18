const path = require('path')
const assert = require('chai').assert

const itk = require(path.resolve(__dirname, '..', 'dist', 'itk.js'))

describe('ImageType', function () {
  describe('#pixelType', function () {
    it('should have a default value of UInt8', function () {
      let imageType = new itk.ImageType()
      assert.equal(imageType.pixelType, itk.UInt8)
    })
    it('should have the same value passed to the constructor', function () {
      let imageType = new itk.ImageType(itk.Int8)
      assert.equal(imageType.pixelType, itk.Int8)
    })
  })
})
