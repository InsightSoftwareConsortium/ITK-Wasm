import test from 'ava'
import path from 'path'

const ImageType = require(path.resolve(__dirname, '..', 'dist', 'ImageType.js'))
const IntTypes = require(path.resolve(__dirname, '..', 'dist', 'IntTypes.js'))
const PixelTypes = require(path.resolve(__dirname, '..', 'dist', 'PixelTypes.js'))

test('dimension should have a default value of 2', t => {
  let imageType = new ImageType()
  t.is(imageType.dimension, 2)
})
test('dimension should have the same value passed to the constructor', t => {
  let imageType = new ImageType(3)
  t.is(imageType.dimension, 3)
})

test('componentType should have a default value of UInt8', t => {
  let imageType = new ImageType()
  t.is(imageType.componentType, IntTypes.UInt8)
})
test('componentType should have the same value passed to the constructor', t => {
  let imageType = new ImageType(3, IntTypes.UInt16)
  t.is(imageType.componentType, IntTypes.UInt16)
})

test('pixelType should have a default componentType of Scalar', t => {
  let imageType = new ImageType()
  t.is(imageType.pixelType, PixelTypes.Scalar)
})
test('pixelType should have the same value passed to the constructor', t => {
  let imageType = new ImageType(3, IntTypes.UInt16, PixelTypes.SymmetricSecondRankTensor)
  t.is(imageType.pixelType, PixelTypes.SymmetricSecondRankTensor)
})

test('component should have a default components of 1', t => {
  let imageType = new ImageType()
  t.is(imageType.components, 1)
})
test('components should have the same value passed to the constructor', t => {
  let imageType = new ImageType(3, IntTypes.UInt16, PixelTypes.SymmetricSecondRankTensor, 2)
  t.is(imageType.components, 2)
})
