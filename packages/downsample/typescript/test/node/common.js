import path from 'path'
import fs from 'fs'

export const testInputPath = path.resolve('..', 'test', 'data', 'input')
export const testBaselinePath = path.resolve('..', 'test', 'data', 'baseline')
export const testOutputPath = path.resolve('..', 'test', 'output', 'typescript')
fs.mkdirSync(testOutputPath, { recursive: true })

export function arraysAlmostEqual (actual, expected, tolerance = 1e-6) {
  return (
    actual.length === expected.length &&
    expected.every((value, index) => Math.abs(actual[index] - value) < tolerance)
  )
}