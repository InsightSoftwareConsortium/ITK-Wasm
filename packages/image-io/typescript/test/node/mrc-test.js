import test from 'ava'
import path from 'path'

import { mrcReadImageNode } from '../../dist/bundles/image-io-node.js'
import { IntTypes, PixelTypes, getMatrixElement } from 'itk-wasm'

import { testInputPath } from './common.js'

const testInputFilePath = path.join(testInputPath, 'tilt_series_little.mrc')

const verifyImage = (t, image) => {
  t.is(image.imageType.dimension, 3, 'dimension')
  t.is(image.imageType.componentType, IntTypes.UInt8, 'componentType')
  t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
  t.is(image.imageType.components, 1, 'components')
  t.is(image.origin[0], 30, 'origin[0]')
  t.is(image.origin[1], 30, 'origin[1]')
  t.is(image.origin[2], 0, 'origin[2]')
  t.is(image.spacing[0], 62.0, 'spacing[0]')
  t.is(image.spacing[1], 62.0, 'spacing[1]')
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
  t.is(image.size[0], 34, 'size[0]')
  t.is(image.size[1], 34, 'size[1]')
  t.is(image.size[2], 141, 'size[2]')
  t.is(image.data.length, 162996, 'data.length')
  t.is(image.data[1000], 162, 'data[1000]')
}

test('Test reading a MRC file', async t => {
  const { couldRead, image } = await mrcReadImageNode(testInputFilePath)
  t.true(couldRead)
  verifyImage(t, image)
})
