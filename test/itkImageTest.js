const path = require('path')
const assert = require('chai').assert

const Image = require(path.resolve(__dirname, '..', 'dist', 'itkImage.js'))
const ImageType = require(path.resolve(__dirname, '..', 'dist', 'itkImageType.js'))
const IntTypes = require(path.resolve(__dirname, '..', 'dist', 'itkIntTypes.js'))

describe('Image', function () {
  describe('#imageType', function () {
    it('should have the same imageType passed to the constructor', function () {
      let image = new Image()
      const defaultImageType = new ImageType()
      assert.deepEqual(image.imageType, defaultImageType)
    })
  })

  describe('#origin', function () {
    it('should have a length equal to the dimension', function () {
      let imageType = new ImageType(2, IntTypes.UInt8)
      let image = new Image(imageType)
      assert.lengthOf(image.origin, 2)

      imageType = new ImageType(3, IntTypes.UInt8)
      image = new Image(imageType)
      assert.lengthOf(image.origin, 3)
    })

    it('should have a default value of 0.0', function () {
      let imageType = new ImageType(2, IntTypes.UInt8)
      let image = new Image(imageType)
      assert.equal(image.origin[0], 0.0)
    })
  })

  describe('#spacing', function () {
    it('should have a length equal to the dimension', function () {
      let imageType = new ImageType(2, IntTypes.UInt8)
      let image = new Image(imageType)
      assert.lengthOf(image.spacing, 2)

      imageType = new ImageType(3, IntTypes.UInt8)
      image = new Image(imageType)
      assert.lengthOf(image.spacing, 3)
    })

    it('should have a default value of 1.0', function () {
      let imageType = new ImageType(2, IntTypes.UInt8)
      let image = new Image(imageType)
      assert.equal(image.spacing[0], 1.0)
    })
  })

  describe('#direction', function () {
    it('should same number of rows and colums as the dimension', function () {
      let imageType = new ImageType(3, IntTypes.UInt8)
      let image = new Image(imageType)
      assert.equal(image.direction.rows, 3)
      assert.equal(image.direction.columns, 3)
    })

    it('should be the identity by default', function () {
      let imageType = new ImageType(2)
      let image = new Image(imageType)
      assert.equal(image.direction.data[0], 1.0)
      assert.equal(image.direction.data[1], 0.0)
      assert.equal(image.direction.data[2], 0.0)
      assert.equal(image.direction.data[3], 1.0)
    })
  })

  describe('#size', function () {
    it('should have a length equal to the dimension', function () {
      let imageType = new ImageType(2)
      let image = new Image(imageType)
      assert.lengthOf(image.size, 2)

      imageType = new ImageType(3)
      image = new Image(imageType)
      assert.lengthOf(image.size, 3)
    })

    it('should have a default value of 0', function () {
      let imageType = new ImageType(2)
      let image = new Image(imageType)
      assert.equal(image.size[0], 0)
    })
  })

  describe('#buffer', function () {
    it('should have a default value of null', function () {
      let imageType = new ImageType(2)
      let image = new Image(imageType)
      assert.equal(image.buffer, null)
    })
  })
})
