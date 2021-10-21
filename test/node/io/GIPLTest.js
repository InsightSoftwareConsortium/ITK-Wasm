import test from 'ava'
import path from 'path'

import { IntTypes, PixelTypes, readImageLocalFile, writeImageLocalFile } from '../../../dist/index.js'

const testInputFilePath = path.resolve('build', 'ExternalData', 'test', 'Input', 'ramp.gipl')
const testOutputFilePath = path.resolve('build', 'Testing', 'Temporary', 'GIPLTest-ramp.gipl')

const verifyImage = (t, image) => {
  t.is(image.imageType.dimension, 3, 'dimension')
  t.is(image.imageType.componentType, IntTypes.Int16, 'componentType')
  t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
  t.is(image.imageType.components, 1, 'components')
  t.is(image.origin[0], 0.0, 'origin[0]')
  t.is(image.origin[1], 0.0, 'origin[1]')
  t.is(image.origin[2], 0.0, 'origin[2]')
  t.is(image.spacing[0], 1.0, 'spacing[0]')
  t.is(image.spacing[1], 1.0, 'spacing[1]')
  t.is(image.spacing[2], 1.0, 'spacing[2]')
  t.is(image.direction.getElement(0, 0), 1.0, 'direction (0, 0)')
  t.is(image.direction.getElement(0, 1), 0.0, 'direction (0, 1)')
  t.is(image.direction.getElement(0, 2), 0.0, 'direction (0, 2)')
  t.is(image.direction.getElement(1, 0), 0.0, 'direction (1, 0)')
  t.is(image.direction.getElement(1, 1), 1.0, 'direction (1, 1)')
  t.is(image.direction.getElement(1, 2), 0.0, 'direction (1, 2)')
  t.is(image.direction.getElement(2, 0), 0.0, 'direction (2, 0)')
  t.is(image.direction.getElement(2, 1), 0.0, 'direction (2, 1)')
  t.is(image.direction.getElement(2, 2), 1.0, 'direction (2, 2)')
  t.is(image.size[0], 30, 'size[0]')
  t.is(image.size[1], 30, 'size[1]')
  t.is(image.size[2], 30, 'size[2]')
  t.is(image.data.length, 27000, 'data.length')
  t.is(image.data[2], 2, 'data[2]')
}

test('Test reading a GIPL file', t => {
  return readImageLocalFile(testInputFilePath).then(function (image) {
    verifyImage(t, image)
  })
})

test('Test writing a GIPL file', t => {
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
