const Matrix = require('./itkMatrix.js')

const setMatrixElement = (matrix, row, column, value) => {
  let newMatrix = new Matrix(matrix)
  newMatrix.data[column + row * newMatrix.columns] = value
  return newMatrix
}

module.exports = setMatrixElement
