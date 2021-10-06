import test from 'ava'
import path from 'path'

import { IntTypes, PixelTypes, readImageLocalFile, writeImageLocalFile } from '../../../dist/index.js'

const testInputFilePath = path.resolve('build', 'ExternalData', 'test', 'Input', 'cthead1.png')
const testOutputFilePath = path.resolve('build', 'Testing', 'Temporary', 'TestPNG-cthead1.png')

const verifyImage = (t, image) => {
  t.is(image.imageType.dimension, 2, 'dimension')
  t.is(image.imageType.componentType, IntTypes.UInt8, 'componentType')
  t.is(image.imageType.pixelType, PixelTypes.RGB, 'pixelType')
  t.is(image.imageType.components, 3, 'components')
  t.is(image.origin[0], 0.0, 'origin[0]')
  t.is(image.origin[1], 0.0, 'origin[1]')
  t.is(image.spacing[0], 1.0, 'spacing[0]')
  t.is(image.spacing[1], 1.0, 'spacing[1]')
  t.is(image.direction.getElement(0, 0), 1.0, 'direction (0, 0)')
  t.is(image.direction.getElement(0, 1), 0.0, 'direction (0, 1)')
  t.is(image.direction.getElement(1, 0), 0.0, 'direction (1, 0)')
  t.is(image.direction.getElement(1, 1), 1.0, 'direction (1, 1)')
  t.is(image.size[0], 256, 'size[0]')
  t.is(image.size[1], 256, 'size[1]')
  t.is(image.data.length, 196608, 'data.length')
}

test('Test reading a PNG file', t => {
  return readImageLocalFile(testInputFilePath).then(function (image) {
    verifyImage(t, image)
  })
})

test('Test writing a PNG file', t => {
  return readImageLocalFile(testInputFilePath).then(function (image) {
    const useCompression = false
    return writeImageLocalFile(useCompression, image, testOutputFilePath)
  })
    .then(function () {
      return readImageLocalFile(testOutputFilePath).then(function (image) {
        verifyImage(t, image)
      })
    })
})
