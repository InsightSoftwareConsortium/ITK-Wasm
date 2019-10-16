import test from 'ava'
import path from 'path'

const Image = require(path.resolve(__dirname, '..', 'dist', 'Image.js'))
const ImageType = require(path.resolve(__dirname, '..', 'dist', 'ImageType.js'))
const IntTypes = require(path.resolve(__dirname, '..', 'dist', 'IntTypes.js'))

test('imageType should have the same imageType passed to the constructor', t => {
  const image = new Image()
  const defaultImageType = new ImageType()
  t.deepEqual(image.imageType, defaultImageType)
})

test('name should have the default value of "Image"', t => {
  const image = new Image()
  t.deepEqual(image.name, 'Image')
})

test('origin should have a length equal to the dimension', t => {
  let imageType = new ImageType(2, IntTypes.UInt8)
  let image = new Image(imageType)
  t.is(image.origin.length, 2)

  imageType = new ImageType(3, IntTypes.UInt8)
  image = new Image(imageType)
  t.is(image.origin.length, 3)
})

test('origin should have a default value of 0.0', t => {
  const imageType = new ImageType(2, IntTypes.UInt8)
  const image = new Image(imageType)
  t.is(image.origin[0], 0.0)
})

test('spacing should have a length equal to the dimension', t => {
  let imageType = new ImageType(2, IntTypes.UInt8)
  let image = new Image(imageType)
  t.is(image.spacing.length, 2)

  imageType = new ImageType(3, IntTypes.UInt8)
  image = new Image(imageType)
  t.is(image.spacing.length, 3)
})

test('spacing should have a default value of 1.0', t => {
  const imageType = new ImageType(2, IntTypes.UInt8)
  const image = new Image(imageType)
  t.is(image.spacing[0], 1.0)
})

test('direction should same number of rows and colums as the dimension', t => {
  const imageType = new ImageType(3, IntTypes.UInt8)
  const image = new Image(imageType)
  t.is(image.direction.rows, 3)
  t.is(image.direction.columns, 3)
})

test('direction should be the identity by default', t => {
  const imageType = new ImageType(2)
  const image = new Image(imageType)
  t.is(image.direction.data[0], 1.0)
  t.is(image.direction.data[1], 0.0)
  t.is(image.direction.data[2], 0.0)
  t.is(image.direction.data[3], 1.0)
})

test('size should have a length equal to the dimension', t => {
  let imageType = new ImageType(2)
  let image = new Image(imageType)
  t.is(image.size.length, 2)

  imageType = new ImageType(3)
  image = new Image(imageType)
  t.is(image.size.length, 3)
})

test('size should have a default value of 0', t => {
  const imageType = new ImageType(2)
  const image = new Image(imageType)
  t.is(image.size[0], 0)
})

test('data should have a default value of null', t => {
  const imageType = new ImageType(2)
  const image = new Image(imageType)
  t.is(image.data, null)
})
