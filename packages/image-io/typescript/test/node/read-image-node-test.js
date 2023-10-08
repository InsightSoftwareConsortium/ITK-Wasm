import test from 'ava'
import path from 'path'

import { readImageNode } from '../../dist/bundles/image-io-node.js'
import { IntTypes, PixelTypes, getMatrixElement } from 'itk-wasm'

import { testInputPath } from './common.js'

const testInputFilePath = path.join(testInputPath, 'cthead1.png')

function verifyImage (t, image, componentType, pixelType) {
  t.is(image.imageType.dimension, 2)
  t.is(image.imageType.componentType, componentType)
  t.is(image.imageType.pixelType, pixelType)
  t.is(image.imageType.components, 3)
  t.is(image.origin[0], 0.0)
  t.is(image.origin[1], 0.0)
  t.is(image.spacing[0], 1.0)
  t.is(image.spacing[1], 1.0)
  t.is(getMatrixElement(image.direction, 2, 0, 0), 1.0)
  t.is(getMatrixElement(image.direction, 2, 0, 1), 0.0)
  t.is(getMatrixElement(image.direction, 2, 1, 0), 0.0)
  t.is(getMatrixElement(image.direction, 2, 1, 1), 1.0)
  t.is(image.size[0], 256)
  t.is(image.size[1], 256)
  t.is(image.data.length, 196608)
}

test('Test reading a PNG with readImageNode', async t => {
  const image = await readImageNode(testInputFilePath)
  const componentType = IntTypes.UInt8
  const pixelType = PixelTypes.RGB
  verifyImage(t, image, componentType, pixelType)
})

test('Test reading a PNG with readImageNode, cast to the specified componentType', async t => {
  const componentType = IntTypes.UInt16
  const image = await readImageNode(testInputFilePath, { componentType })
  const pixelType = PixelTypes.RGB
  verifyImage(t, image, componentType, pixelType)
})

test('Test reading a PNG with readImageNode, cast to the specified pixelType', async t => {
  const pixelType = PixelTypes.Vector
  const image = await readImageNode(testInputFilePath, { pixelType })
  const componentType = IntTypes.UInt8
  verifyImage(t, image, componentType, pixelType)
})
