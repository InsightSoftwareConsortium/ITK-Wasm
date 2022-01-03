import test from 'ava'
import path from 'path'

import { IntTypes, PixelTypes, getMatrixElement, readImageLocalFile, writeImageLocalFile } from '../../../../dist/index.js'

const testInputFilePath = path.resolve('build', 'ExternalData', 'test', 'Input', 'brainweb165a10f17.mha')
const testOutputFilePath = path.resolve('build', 'Testing', 'Temporary', 'MetaImageTest-brainweb165a10f17.mha')
const testSmallInputFilePath = path.resolve('build', 'ExternalData', 'test', 'Input', '3x2.mha')
const testSmallOutputFilePath = path.resolve('build', 'Testing', 'Temporary', '3x2.mha')

const verifyImage = (t, image) => {
  t.is(image.imageType.dimension, 3, 'dimension')
  t.is(image.imageType.componentType, IntTypes.UInt8, 'componentType')
  t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
  t.is(image.imageType.components, 1, 'components')
  t.is(image.origin[0], 0.0, 'origin[0]')
  t.is(image.origin[1], 0.0, 'origin[1]')
  t.is(image.origin[2], 0.0, 'origin[2]')
  t.is(image.spacing[0], 1.0, 'spacing[0]')
  t.is(image.spacing[1], 1.0, 'spacing[1]')
  t.is(image.spacing[2], 1.0, 'spacing[2]')
  t.is(getMatrixElement(image.direction, 3, 0, 0), 1.0, 'direction (0, 0)')
  t.is(getMatrixElement(image.direction, 3, 0, 1), 0.0, 'direction (0, 1)')
  t.is(getMatrixElement(image.direction, 3, 0, 2), 0.0, 'direction (0, 2)')
  t.is(getMatrixElement(image.direction, 3, 1, 0), 0.0, 'direction (1, 0)')
  t.is(getMatrixElement(image.direction, 3, 1, 1), 1.0, 'direction (1, 1)')
  t.is(getMatrixElement(image.direction, 3, 1, 2), 0.0, 'direction (1, 2)')
  t.is(getMatrixElement(image.direction, 3, 2, 0), 0.0, 'direction (2, 0)')
  t.is(getMatrixElement(image.direction, 3, 2, 1), 0.0, 'direction (2, 1)')
  t.is(getMatrixElement(image.direction, 3, 2, 2), 1.0, 'direction (2, 2)')
  t.is(image.size[0], 181, 'size[0]')
  t.is(image.size[1], 217, 'size[1]')
  t.is(image.size[2], 180, 'size[2]')
  t.is(image.data.length, 7069860, 'data.length')
  t.is(image.data[0], 5, 'data[0]')
  t.is(image.data[1], 8, 'data[1]')
  t.is(image.data[2], 2, 'data[2]')
  t.is(image.data[1000], 17, 'data[1000]')
}

test('Test reading a MetaImage file', t => {
  return readImageLocalFile(testInputFilePath).then(function (image) {
    verifyImage(t, image)
  })
})

test('Test writing a MetaImage file', t => {
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

const verifySmallImage = (t, image) => {
  t.is(image.imageType.dimension, 2, 'dimension')
  t.is(image.imageType.componentType, IntTypes.UInt8, 'componentType')
  t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
  t.is(image.imageType.components, 1, 'components')
  t.is(image.origin[0], 20.0, 'origin[0]')
  t.is(image.origin[1], 10.0, 'origin[1]')
  t.is(image.spacing[0], 3.0, 'spacing[0]')
  t.is(image.spacing[1], 4.0, 'spacing[1]')
  t.is(getMatrixElement(image.direction, 2, 0, 0), 1.0, 'direction (0, 0)')
  t.is(getMatrixElement(image.direction, 2, 0, 1), 0.0, 'direction (0, 1)')
  t.is(getMatrixElement(image.direction, 2, 1, 0), 0.0, 'direction (1, 0)')
  t.is(getMatrixElement(image.direction, 2, 1, 1), 1.0, 'direction (1, 1)')
  t.is(image.size[0], 2, 'size[0]')
  t.is(image.size[1], 3, 'size[1]')
  t.is(image.data.length, 6, 'data.length')
  t.is(image.data[0], 0, 'data[0]')
  t.is(image.data[1], 1, 'data[1]')
  t.is(image.data[2], 2, 'data[2]')
  t.is(image.data[3], 3, 'data[3]')
  t.is(image.data[4], 4, 'data[4]')
  t.is(image.data[5], 5, 'data[5]')
}

test('Test reading a small MetaImage file', async t => {
  const image = await readImageLocalFile(testSmallInputFilePath)
  verifySmallImage(t, image)
})

test('Test writing a small MetaImage file', async t => {
  let image = await readImageLocalFile(testSmallInputFilePath)
  verifySmallImage(t, image)
  const useCompression = false
  await writeImageLocalFile(useCompression, image, testSmallOutputFilePath)
  image = await readImageLocalFile(testSmallOutputFilePath)
  verifySmallImage(t, image)
})
