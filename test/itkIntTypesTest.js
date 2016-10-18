const path = require('path')
const assert = require('chai').assert

const itk = require(path.resolve(__dirname, '..', 'dist', 'itk.js'))

describe('IntTypes', function () {
  describe('#Int8', function () {
    it('should be defined', function () {
      let type = itk.Int8
      assert.equal(type, 'int8_t')
    })
  })

  describe('#UInt8', function () {
    it('should be defined', function () {
      let type = itk.UInt8
      assert.equal(type, 'uint8_t')
    })
  })

  describe('#Int16', function () {
    it('should be defined', function () {
      let type = itk.Int16
      assert.equal(type, 'int16_t')
    })
  })

  describe('#UInt16', function () {
    it('should be defined', function () {
      let type = itk.UInt16
      assert.equal(type, 'uint16_t')
    })
  })

  describe('#Int32', function () {
    it('should be defined', function () {
      let type = itk.Int32
      assert.equal(type, 'int32_t')
    })
  })

  describe('#UInt32', function () {
    it('should be defined', function () {
      let type = itk.UInt32
      assert.equal(type, 'uint32_t')
    })
  })

  describe('#Int64', function () {
    it('should be defined', function () {
      let type = itk.Int64
      assert.equal(type, 'int64_t')
    })
  })

  describe('#UInt64', function () {
    it('should be defined', function () {
      let type = itk.UInt64
      assert.equal(type, 'uint64_t')
    })
  })

  describe('#SizeValueType', function () {
    it('should be defined', function () {
      let type = itk.SizeValueType
      assert.equal(type, 'uint64_t')
    })
    it('should be equal to UInt64', function () {
      let type = itk.SizeValueType
      assert.equal(type, 'uint64_t')
    })
  })

  describe('#IdentifierType', function () {
    it('should be defined', function () {
      let type = itk.IdentifierType
      assert.equal(type, 'uint64_t')
    })
    it('should be equal to UInt64', function () {
      let type = itk.IdentifierType
      assert.equal(type, 'uint64_t')
    })
  })

  describe('#IndexValueType', function () {
    it('should be defined', function () {
      let type = itk.IndexValueType
      assert.equal(type, 'int64_t')
    })
    it('should be equal to Int64', function () {
      let type = itk.IndexValueType
      assert.equal(type, 'int64_t')
    })
  })

  describe('#OffsetValueType', function () {
    it('should be defined', function () {
      let type = itk.OffsetValueType
      assert.equal(type, 'int64_t')
    })
    it('should be equal to Int64', function () {
      let type = itk.OffsetValueType
      assert.equal(type, 'int64_t')
    })
  })
})
