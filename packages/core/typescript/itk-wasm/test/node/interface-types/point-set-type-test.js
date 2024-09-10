import test from 'ava'

import { PointSetType, FloatTypes } from '../../../dist/index-node.js'

test('dimension should have a default value of 3', t => {
  const pointSetType = new PointSetType()
  t.is(pointSetType.dimension, 3)
})
test('dimension should have the same value passed to the constructor', t => {
  const pointSetType = new PointSetType(2)
  t.is(pointSetType.dimension, 2)
})

test('pointComponentType should have a default value of Float32', t => {
  const pointSetType = new PointSetType()
  t.is(pointSetType.pointComponentType, FloatTypes.Float32)
})
test('pointComponentType should have the same value passed to the constructor', t => {
  const pointSetType = new PointSetType(3, FloatTypes.Float64)
  t.is(pointSetType.pointComponentType, FloatTypes.Float64)
})

test('pointPixelComponentType should have a default value of Float32', t => {
  const pointSetType = new PointSetType()
  t.is(pointSetType.pointPixelComponentType, FloatTypes.Float32)
})
test('pointPixelComponentType should have the same value passed to the constructor', t => {
  const pointSetType = new PointSetType(3, FloatTypes.Float64, FloatTypes.Float64)
  t.is(pointSetType.pointPixelComponentType, FloatTypes.Float64)
})
