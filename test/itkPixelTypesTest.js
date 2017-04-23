const path = require('path')
const assert = require('chai').assert

const PixelTypes = require(path.resolve(__dirname, '..', 'dist', 'itkPixelTypes.js'))

describe('PixelTypes', function () {
  describe('#Unknown', function () {
    it('should be defined', function () {
      let type = PixelTypes.Unknown
      assert.equal(type, 0)
    })
  })
})
