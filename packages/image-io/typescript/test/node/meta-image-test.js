import test from 'ava'
import path from 'path'

import { metaReadImageNode, metaWriteImageNode } from '../../dist/index-node.js'
import { IntTypes, PixelTypes, getMatrixElement } from 'itk-wasm'

import { testInputPath, testOutputPath } from './common.js'

const testInputFilePath = path.join(testInputPath, 'brainweb165a10f17.mha')
const testOutputFilePath = path.join(testOutputPath, 'meta-image-test-brainweb165a10f17.mha')
const testSmallInputFilePath = path.join(testInputPath, '3x2.mha')
const testSmallOutputFilePath = path.join(testOutputPath, 'meta-image-test-3x2.mha')

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

test('Test reading a MetaImage file', async t => {
  const { couldRead, image } = await metaReadImageNode(testInputFilePath)
  t.true(couldRead)
  verifyImage(t, image)
})

test('Test writing a MetaImage file', async t => {
  const { couldRead, image } = await metaReadImageNode(testInputFilePath)
  t.true(couldRead)
  const { couldWrite } = await metaWriteImageNode(image, testOutputFilePath)
  t.true(couldWrite)
  const { couldRead: couldReadBack, image: imageBack } = await metaReadImageNode(testOutputFilePath)
  t.true(couldReadBack)
  verifyImage(t, imageBack)
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
  const { couldRead, image } = await metaReadImageNode(testSmallInputFilePath)
  t.true(couldRead)
  verifySmallImage(t, image)
})

test('Test writing a small MetaImage file', async t => {
  const { couldRead, image } = await metaReadImageNode(testSmallInputFilePath)
  t.true(couldRead)
  const { couldWrite } = await metaWriteImageNode(image, testSmallOutputFilePath)
  t.true(couldWrite)
  const { couldRead: couldReadBack, image: imageBack } = await metaReadImageNode(testSmallOutputFilePath)
  t.true(couldReadBack)
  verifySmallImage(t, imageBack)
})
