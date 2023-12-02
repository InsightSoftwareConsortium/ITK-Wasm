import test from 'ava'

import { FloatTypes } from '../../../dist/index-node.js'

test('Float32 should be defined', t => {
  const type = FloatTypes.Float32
  t.is(type, 'float32')
})

test('Float64 should be defined', t => {
  const type = FloatTypes.Float64
  t.is(type, 'float64')
})

test('SpacePrecisionType should be defined', t => {
  const type = FloatTypes.SpacePrecisionType
  t.is(type, 'float64')
})
