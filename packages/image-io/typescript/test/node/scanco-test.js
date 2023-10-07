import test from 'ava'
import path from 'path'

import { scancoReadImageNode, scancoWriteImageNode } from '../../dist/bundles/image-io-node.js'
import { IntTypes, PixelTypes, getMatrixElement } from 'itk-wasm'

import { testInputPath, testOutputPath } from './common.js'

const testInputFilePath = path.join(testInputPath, 'C0004255.ISQ')
const testOutputFilePath = path.join(testOutputPath, 'C0004255.iwi.cbor')

const verifyImage = (t, image) => {
  t.is(image.imageType.dimension, 3, 'dimension')
  t.is(image.imageType.componentType, IntTypes.Int16, 'componentType')
  t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
  t.is(image.imageType.components, 1, 'components')
  t.is(image.origin[0], 0.0, 'origin[0]')
  t.is(image.origin[1], 0.0, 'origin[1]')
  t.is(image.spacing[0], 0.036000000000000004, 'spacing[0]')
  t.is(image.spacing[1], 0.036000000000000004, 'spacing[1]')
  t.is(getMatrixElement(image.direction, 3, 0, 0), 1.0, 'direction (0, 0)')
  t.is(getMatrixElement(image.direction, 3, 0, 1), 0.0, 'direction (0, 1)')
  t.is(getMatrixElement(image.direction, 3, 1, 0), 0.0, 'direction (1, 0)')
  t.is(getMatrixElement(image.direction, 3, 1, 1), 1.0, 'direction (1, 1)')
  t.is(image.size[0], 1024, 'size[0]')
  t.is(image.size[1], 1024, 'size[1]')
  t.is(image.data.length, 53477376, 'data.length')
  t.is(image.data[100000], -292, 'data[100000]')
}

test('Test reading a Scanco file', async t => {
  const { couldRead, image } = await scancoReadImageNode(testInputFilePath)
  t.true(couldRead)
  verifyImage(t, image)
})
