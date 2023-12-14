import test from 'ava'

import { IntTypes, ImageType, PixelTypes } from '../../../dist/index-node.js'

test('dimension should have a default value of 2', t => {
  const imageType = new ImageType()
  t.is(imageType.dimension, 2)
})
test('dimension should have the same value passed to the constructor', t => {
  const imageType = new ImageType(3)
  t.is(imageType.dimension, 3)
})

test('componentType should have a default value of UInt8', t => {
  const imageType = new ImageType()
  t.is(imageType.componentType, IntTypes.UInt8)
})
test('componentType should have the same value passed to the constructor', t => {
  const imageType = new ImageType(3, IntTypes.UInt16)
  t.is(imageType.componentType, IntTypes.UInt16)
})

test('pixelType should have a default componentType of Scalar', t => {
  const imageType = new ImageType()
  t.is(imageType.pixelType, PixelTypes.Scalar)
})
test('pixelType should have the same value passed to the constructor', t => {
  const imageType = new ImageType(3, IntTypes.UInt16, PixelTypes.SymmetricSecondRankTensor)
  t.is(imageType.pixelType, PixelTypes.SymmetricSecondRankTensor)
})

test('component should have a default components of 1', t => {
  const imageType = new ImageType()
  t.is(imageType.components, 1)
})
test('components should have the same value passed to the constructor', t => {
  const imageType = new ImageType(3, IntTypes.UInt16, PixelTypes.SymmetricSecondRankTensor, 2)
  t.is(imageType.components, 2)
})
