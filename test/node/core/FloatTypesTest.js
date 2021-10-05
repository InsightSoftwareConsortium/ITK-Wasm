import test from 'ava'
import path from 'path'

import { FloatTypes } from '../../../dist/index.js'

test('Float32 should be defined', t => {
  const type = FloatTypes.Float32
  t.is(type, 'float')
})

test('Float64 should be defined', t => {
  const type = FloatTypes.Float64
  t.is(type, 'double')
})

test('SpacePrecisionType should be defined', t => {
  const type = FloatTypes.SpacePrecisionType
  t.is(type, 'double')
})
