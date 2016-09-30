const path = require('path')
const assert = require('chai').assert

const itk = require(path.resolve(__dirname, '..', 'dist', 'itk.js'))

describe('Matrix', function () {
  describe('#rows', function () {
    it('should have the same number of rows as passed into the constructor', function () {
      let matrix = new itk.Matrix(2, 3)
      assert.equal(matrix.rows, 2)
    })
  })

  describe('#columns', function () {
    it('should have the same number of columns as passed into the constructor', function () {
      let matrix = new itk.Matrix(2, 3)
      assert.equal(matrix.columns, 3)
    })
  })

  describe('#data', function () {
    it('should have the same number of columns as passed into the constructor', function () {
      let matrix = new itk.Matrix(2, 3)
      assert.equal(matrix.columns, 3)
    })
  })

  describe('#setIdentity()', function () {
    it('should set the matrix to the identity', function () {
      let matrix = new itk.Matrix(2, 2)
      matrix.setIdentity()
      assert.equal(matrix.data[0], 1.0)
      assert.equal(matrix.data[1], 0.0)
      assert.equal(matrix.data[2], 0.0)
      assert.equal(matrix.data[3], 1.0)
    })
  })
})
