import test from 'ava'

import { MeshType, FloatTypes, IntTypes, PixelTypes } from '../../../dist/index-node.js'

test('dimension should have a default value of 2', t => {
  const meshType = new MeshType()
  t.is(meshType.dimension, 2)
})
test('dimension should have the same value passed to the constructor', t => {
  const meshType = new MeshType(3)
  t.is(meshType.dimension, 3)
})

test('pointComponentType should have a default value of Float32', t => {
  const meshType = new MeshType()
  t.is(meshType.pointComponentType, FloatTypes.Float32)
})
test('pointComponentType should have the same value passed to the constructor', t => {
  const meshType = new MeshType(3, FloatTypes.Float64)
  t.is(meshType.pointComponentType, FloatTypes.Float64)
})

test('pointPixelComponentType should have a default value of Float32', t => {
  const meshType = new MeshType()
  t.is(meshType.pointPixelComponentType, FloatTypes.Float32)
})
test('pointPixelComponentType should have the same value passed to the constructor', t => {
  const meshType = new MeshType(3, FloatTypes.Float64, FloatTypes.Float64)
  t.is(meshType.pointPixelComponentType, FloatTypes.Float64)
})

test('cellComponentType should have a default value of Int32', t => {
  const meshType = new MeshType()
  t.is(meshType.cellComponentType, IntTypes.Int32)
})
test('cellComponentType should have the same value passed to the constructor', t => {
  const meshType = new MeshType(3, FloatTypes.Float64, FloatTypes.Float64, PixelTypes.SymmetricSecondRankTensor, 1, FloatTypes.Float64)
  t.is(meshType.cellComponentType, FloatTypes.Float64, FloatTypes.Float64)
})

test('pointPixelType should have a default componentType of Scalar', t => {
  const meshType = new MeshType()
  t.is(meshType.pointPixelType, PixelTypes.Scalar)
})
test('pointPixelType should have the same value passed to the constructor', t => {
  const meshType = new MeshType(3, FloatTypes.Float64, FloatTypes.Float64, PixelTypes.SymmetricSecondRankTensor)
  t.is(meshType.pointPixelType, PixelTypes.SymmetricSecondRankTensor)
})

test('celPixelComponentType should have a default componentType of Float32', t => {
  const meshType = new MeshType()
  t.is(meshType.cellPixelComponentType, FloatTypes.Float32)
})
test('cellPixelComponentType should have the same value passed to the constructor', t => {
  const meshType = new MeshType(3, FloatTypes.Float64, FloatTypes.Float64, PixelTypes.SymmetricSecondRankTensor, 1, FloatTypes.Float64, FloatTypes.Float64, PixelTypes.SymmetricSecondRankTensor)
  t.is(meshType.cellPixelComponentType, FloatTypes.Float64)
})

test('cellPixelType should have a default componentType of Scalar', t => {
  const meshType = new MeshType()
  t.is(meshType.cellPixelType, PixelTypes.Scalar)
})
test('cellPixelType should have the same value passed to the constructor', t => {
  const meshType = new MeshType(3, FloatTypes.Float64, FloatTypes.Float64, PixelTypes.SymmetricSecondRankTensor, 1, FloatTypes.Float64, FloatTypes.Float64, PixelTypes.SymmetricSecondRankTensor)
  t.is(meshType.cellPixelType, PixelTypes.SymmetricSecondRankTensor)
})

test('pointPixelComponents should have a default components of 1', t => {
  const meshType = new MeshType()
  t.is(meshType.pointPixelComponents, 1)
})
test('pointPixelComponents should have the same value passed to the constructor', t => {
  const meshType = new MeshType(3, FloatTypes.Float64, FloatTypes.Float64, PixelTypes.SymmetricSecondRankTensor, 2)
  t.is(meshType.pointPixelComponents, 2)
})

test('cellPixelComponents should have a default components of 1', t => {
  const meshType = new MeshType()
  t.is(meshType.cellPixelComponents, 1)
})
test('cellPixelComponents should have the same value passed to the constructor', t => {
  const meshType = new MeshType(3, FloatTypes.Float64, FloatTypes.Float64, PixelTypes.SymmetricSecondRankTensor, 2, FloatTypes.Float64, FloatTypes.Float64, PixelTypes.SymmetricSecondRankTensor, 2)
  t.is(meshType.cellPixelComponents, 2)
})
