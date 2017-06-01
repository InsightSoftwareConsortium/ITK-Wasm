import test from 'ava'
import path from 'path'

const FloatTypes = require(path.resolve(__dirname, '..', 'dist', 'FloatTypes.js'))

test('Float32 should be defined', t => {
  let type = FloatTypes.Float32
  t.is(type, 'float')
})

test('Float64 should be defined', t => {
  let type = FloatTypes.Float64
  t.is(type, 'double')
})

test('SpacePrecisionType should be defined', t => {
  let type = FloatTypes.SpacePrecisionType
  t.is(type, 'double')
})
