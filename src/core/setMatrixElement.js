import TypedArray from './TypedArray.js'

function setMatrixElement (matrixData: TypedArray, columns: number, row: number, column: number, value: number): void {
  matrixData[column + row * columns] = value
}

export default setMatrixElement
