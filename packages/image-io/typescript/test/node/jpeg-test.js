import test from 'ava'
import path from 'path'

import { jpegReadImageNode } from '../../dist/bundles/image-io-node.js'
import { IntTypes, PixelTypes, getMatrixElement } from 'itk-wasm'

import { testInputPath } from './common.js'

const testInputFilePath = path.join(testInputPath, 'apple.jpg')

test('Test reading a JPEG file', async t => {
  const { couldRead, image } = await jpegReadImageNode(testInputFilePath)
  t.true(couldRead)
  t.is(image.imageType.dimension, 2, 'dimension')
  t.is(image.imageType.componentType, IntTypes.UInt8, 'componentType')
  t.is(image.imageType.pixelType, PixelTypes.RGB, 'pixelType')
  t.is(image.imageType.components, 3, 'components')
  t.is(image.origin[0], 0.0, 'origin[0]')
  t.is(image.origin[1], 0.0, 'origin[1]')
  t.is(image.spacing[0], 0.35277777777777775, 'spacing[0]')
  t.is(image.spacing[1], 0.35277777777777775, 'spacing[1]')
  t.is(getMatrixElement(image.direction, 2, 0, 0), 1.0, 'direction (0, 0)')
  t.is(getMatrixElement(image.direction, 2, 0, 1), 0.0, 'direction (0, 1)')
  t.is(getMatrixElement(image.direction, 2, 1, 0), 0.0, 'direction (1, 0)')
  t.is(getMatrixElement(image.direction, 2, 1, 1), 1.0, 'direction (1, 1)')
  t.is(image.size[0], 160, 'size[0]')
  t.is(image.size[1], 179, 'size[1]')
  t.is(image.data.length, 85920, 'data.length')
  t.is(image.data[1000], 255, 'data[1000]')
})
