import test from 'ava'

import { PolyDataType, FloatTypes, PixelTypes } from '../../../dist/index-node.js'

test('pointPixelComponentType should have a default value of Float32', t => {
  const polyDataType = new PolyDataType()
  t.is(polyDataType.pointPixelComponentType, FloatTypes.Float32)
})
test('pointPixelComponentType should have the same value passed to the constructor', t => {
  const polyDataType = new PolyDataType(FloatTypes.Float64, FloatTypes.Float64)
  t.is(polyDataType.pointPixelComponentType, FloatTypes.Float64)
})

test('pointPixelType should have a default componentType of Scalar', t => {
  const polyDataType = new PolyDataType()
  t.is(polyDataType.pointPixelType, PixelTypes.Scalar)
})
test('pointPixelType should have the same value passed to the constructor', t => {
  const polyDataType = new PolyDataType(FloatTypes.Float64, PixelTypes.SymmetricSecondRankTensor)
  t.is(polyDataType.pointPixelType, PixelTypes.SymmetricSecondRankTensor)
})

test('cellPixelComponentType should have a default componentType of Float32', t => {
  const polyDataType = new PolyDataType()
  t.is(polyDataType.cellPixelComponentType, FloatTypes.Float32)
})
test('cellPixelComponentType should have the same value passed to the constructor', t => {
  const polyDataType = new PolyDataType(FloatTypes.Float64, PixelTypes.SymmetricSecondRankTensor, 1, FloatTypes.Float64, FloatTypes.Float64, PixelTypes.SymmetricSecondRankTensor)
  t.is(polyDataType.cellPixelComponentType, FloatTypes.Float64)
})

test('cellPixelType should have a default componentType of Scalar', t => {
  const polyDataType = new PolyDataType()
  t.is(polyDataType.cellPixelType, PixelTypes.Scalar)
})
test('cellPixelType should have the same value passed to the constructor', t => {
  const polyDataType = new PolyDataType(FloatTypes.Float64, PixelTypes.SymmetricSecondRankTensor, 1, FloatTypes.Float64, PixelTypes.SymmetricSecondRankTensor)
  t.is(polyDataType.cellPixelType, PixelTypes.SymmetricSecondRankTensor)
})

test('pointPixelComponents should have a default components of 1', t => {
  const polyDataType = new PolyDataType()
  t.is(polyDataType.pointPixelComponents, 1)
})
test('pointPixelComponents should have the same value passed to the constructor', t => {
  const polyDataType = new PolyDataType(FloatTypes.Float64, PixelTypes.SymmetricSecondRankTensor, 2)
  t.is(polyDataType.pointPixelComponents, 2)
})

test('cellPixelComponents should have a default components of 1', t => {
  const polyDataType = new PolyDataType()
  t.is(polyDataType.cellPixelComponents, 1)
})
test('cellPixelComponents should have the same value passed to the constructor', t => {
  const polyDataType = new PolyDataType(FloatTypes.Float64, PixelTypes.SymmetricSecondRankTensor, 2, FloatTypes.Float64, PixelTypes.SymmetricSecondRankTensor, 2)
  t.is(polyDataType.cellPixelComponents, 2)
})
