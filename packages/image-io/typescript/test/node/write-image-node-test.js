import test from 'ava'
import path from 'path'

import { readImageNode, writeImageNode } from '../../dist/index-node.js'
import { IntTypes, PixelTypes, getMatrixElement } from 'itk-wasm'

import { testInputPath, testOutputPath } from './common.js'

const testInputFilePath = path.join(testInputPath, 'cthead1.png')
const testOutputFilePath = path.join(testOutputPath, 'write-image-node-test-cthead1.png')
const testOutputCastFilePath = path.join(testOutputPath, 'write-image-node-test-cast-cthead1.iwi.cbor')

const verifyImage = (t, image, expectedComponentType, expectedPixelType) => {
  t.is(image.imageType.dimension, 2, 'dimension')
  let componentType = IntTypes.UInt8
  if (expectedComponentType) {
    componentType = expectedComponentType
  }
  let pixelType = PixelTypes.RGB
  if (expectedPixelType) {
    pixelType = expectedPixelType
  }
  t.is(image.imageType.componentType, componentType, 'componentType')
  t.is(image.imageType.pixelType, pixelType, 'pixelType')
  t.is(image.imageType.components, 3, 'components')
  t.is(image.origin[0], 0.0, 'origin[0]')
  t.is(image.origin[1], 0.0, 'origin[1]')
  t.is(image.spacing[0], 1.0, 'spacing[0]')
  t.is(image.spacing[1], 1.0, 'spacing[1]')
  t.is(getMatrixElement(image.direction, 2, 0, 0), 1.0, 'direction (0, 0)')
  t.is(getMatrixElement(image.direction, 2, 0, 1), 0.0, 'direction (0, 1)')
  t.is(getMatrixElement(image.direction, 2, 1, 0), 0.0, 'direction (1, 0)')
  t.is(getMatrixElement(image.direction, 2, 1, 1), 1.0, 'direction (1, 1)')
  t.is(image.size[0], 256, 'size[0]')
  t.is(image.size[1], 256, 'size[1]')
  t.is(image.data.length, 196608, 'data.length')
}


test('Test writing a PNG with readImageNode', async t => {
  const image = await readImageNode(testInputFilePath)
  await writeImageNode(image, testOutputFilePath)
  const imageBack = await readImageNode(testOutputFilePath)
  const componentType = IntTypes.UInt8
  const pixelType = PixelTypes.RGB
  verifyImage(t, imageBack, componentType, pixelType)
})

test('Test writing a PNG with writeImageNode, cast to the specified componentType and pixelType', async t => {
  const image = await readImageNode(testInputFilePath)
  const componentType = IntTypes.UInt16
  const pixelType = PixelTypes.Vector
  await writeImageNode(image, testOutputCastFilePath, { componentType, pixelType})
  const imageBack = await readImageNode(testOutputCastFilePath)
  verifyImage(t, imageBack, componentType, pixelType)
})
