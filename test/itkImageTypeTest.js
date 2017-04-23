const path = require('path')
const assert = require('chai').assert

const ImageType = require(path.resolve(__dirname, '..', 'dist', 'itkImageType.js'))
const IntTypes = require(path.resolve(__dirname, '..', 'dist', 'itkIntTypes.js'))
const PixelTypes = require(path.resolve(__dirname, '..', 'dist', 'itkPixelTypes.js'))

describe('ImageType', function () {
  describe('#dimension', function () {
    it('should have a default value of 2', function () {
      let imageType = new ImageType()
      assert.equal(imageType.dimension, 2)
    })
    it('should have the same value passed to the constructor', function () {
      let imageType = new ImageType(3)
      assert.equal(imageType.dimension, 3)
    })
  })

  describe('#componentType', function () {
    it('should have a default value of UInt8', function () {
      let imageType = new ImageType()
      assert.equal(imageType.componentType, IntTypes.UInt8)
    })
    it('should have the same value passed to the constructor', function () {
      let imageType = new ImageType(3, IntTypes.UInt16)
      assert.equal(imageType.componentType, IntTypes.UInt16)
    })
  })

  describe('#pixelType', function () {
    it('should have a default componentType of Scalar', function () {
      let imageType = new ImageType()
      assert.equal(imageType.pixelType, PixelTypes.Scalar)
    })
    it('should have the same value passed to the constructor', function () {
      let imageType = new ImageType(3, IntTypes.UInt16, PixelTypes.SymmetricSecondRankTensor)
      assert.equal(imageType.pixelType, PixelTypes.SymmetricSecondRankTensor)
    })
  })

  describe('#components', function () {
    it('should have a default components of 1', function () {
      let imageType = new ImageType()
      assert.equal(imageType.components, 1)
    })
    it('should have the same value passed to the constructor', function () {
      let imageType = new ImageType(3, IntTypes.UInt16, PixelTypes.SymmetricSecondRankTensor, 2)
      assert.equal(imageType.components, 2)
    })
  })
})
