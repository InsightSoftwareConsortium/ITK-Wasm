import test from 'ava'

import { getMatrixElement, setMatrixElement } from '../../dist/index-node.js'

test('setMatrixElement() should set elements of the matrix', t => {
  const columns = 2
  const rows = 2
  const matrixData = new Float64Array(rows * columns)
  matrixData[0] = 1
  matrixData[1] = 2
  matrixData[2] = 3
  matrixData[3] = 4

  setMatrixElement(matrixData, columns, 0, 0, 7)
  t.is(matrixData[0], 7)
  setMatrixElement(matrixData, columns, 0, 1, 8)
  t.is(matrixData[1], 8)
  setMatrixElement(matrixData, columns, 1, 0, 9)
  t.is(matrixData[2], 9)
  setMatrixElement(matrixData, columns, 1, 1, 10)
  t.is(matrixData[3], 10)
})

test('getMatrixElement() should get elements of the matrix', t => {
  const columns = 2
  const rows = 2
  const matrixData = new Float64Array(rows * columns)
  matrixData[0] = 1
  matrixData[1] = 2
  matrixData[2] = 3
  matrixData[3] = 4

  t.is(getMatrixElement(matrixData, columns, 0, 0), 1)
  t.is(getMatrixElement(matrixData, columns, 0, 1), 2)
  t.is(getMatrixElement(matrixData, columns, 1, 0), 3)
  t.is(getMatrixElement(matrixData, columns, 1, 1), 4)
})
