import TypedArray from './TypedArray.js'

function getMatrixElement (matrixData: TypedArray, columns: number, row: number, column: number): number {
  return matrixData[column + row * columns]
}

export default getMatrixElement
