import Matrix from './Matrix.js'

function getMatrixElement (matrix: Matrix, row: number, column: number): number {
  return matrix.data[column + row * matrix.columns]
}

export default getMatrixElement
