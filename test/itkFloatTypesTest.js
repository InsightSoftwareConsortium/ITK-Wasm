const path = require('path')
const assert = require('chai').assert

const itk = require(path.resolve(__dirname, '..', 'dist', 'itk.js'))

describe('FloatTypes', function () {
  describe('#Float32', function () {
    it('should be defined', function () {
      let type = itk.Float32
      assert.equal(type, 'float')
    })
  })

  describe('#Float64', function () {
    it('should be defined', function () {
      let type = itk.Float64
      assert.equal(type, 'double')
    })
  })

  describe('#SpacePrecisionType', function () {
    it('should be defined', function () {
      let type = itk.SpacePrecisionType
      assert.equal(type, 'double')
    })
    it('should be equal to double', function () {
      let type = itk.SpacePrecisionType
      assert.equal(type, 'double')
    })
  })
})
