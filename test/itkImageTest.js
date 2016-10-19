const path = require('path')
const assert = require('chai').assert

const itk = require(path.resolve(__dirname, '..', 'dist', 'itk.js'))

describe('Image', function () {
  describe('#imageType', function () {
    it('should have the same imageType passed to the constructor', function () {
      let image = new itk.Image()
      const defaultImageType = new itk.ImageType()
      assert.deepEqual(image.imageType, defaultImageType)
    })
  })

  describe('#origin', function () {
    it('should have a length equal to the dimension', function () {
      let imageType = new itk.ImageType(itk.UInt8, 2)
      let image = new itk.Image(imageType)
      assert.lengthOf(image.origin, 2)

      imageType = new itk.ImageType(itk.UInt8, 3)
      image = new itk.Image(imageType)
      assert.lengthOf(image.origin, 3)
    })

    it('should have a default value of 0.0', function () {
      let imageType = new itk.ImageType(itk.UInt8, 2)
      let image = new itk.Image(imageType)
      assert.equal(image.origin[0], 0.0)
    })
  })

  describe('#spacing', function () {
    it('should have a length equal to the dimension', function () {
      let imageType = new itk.ImageType(itk.UInt8, 2)
      let image = new itk.Image(imageType)
      assert.lengthOf(image.spacing, 2)

      imageType = new itk.ImageType(itk.UInt8, 3)
      image = new itk.Image(imageType)
      assert.lengthOf(image.spacing, 3)
    })

    it('should have a default value of 1.0', function () {
      let imageType = new itk.ImageType(itk.UInt8, 2)
      let image = new itk.Image(imageType)
      assert.equal(image.spacing[0], 1.0)
    })
  })

  describe('#direction', function () {
    it('should same number of rows and colums as the dimension', function () {
      let imageType = new itk.ImageType(itk.UInt8, 3)
      let image = new itk.Image(imageType)
      assert.equal(image.direction.rows, 3)
      assert.equal(image.direction.columns, 3)
    })

    it('should be the identity by default', function () {
      let imageType = new itk.ImageType(itk.UInt8, 2)
      let image = new itk.Image(imageType)
      assert.equal(image.direction.data[0], 1.0)
      assert.equal(image.direction.data[1], 0.0)
      assert.equal(image.direction.data[2], 0.0)
      assert.equal(image.direction.data[3], 1.0)
    })
  })
})
