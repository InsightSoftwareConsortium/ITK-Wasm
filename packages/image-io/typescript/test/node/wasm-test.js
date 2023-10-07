import test from 'ava'
import path from 'path'

import { wasmReadImageNode, wasmWriteImageNode } from '../../dist/bundles/image-io-node.js'
import { IntTypes, PixelTypes, getMatrixElement } from 'itk-wasm'

import { testInputPath, testOutputPath } from './common.js'

const testInputFilePath = path.join(testInputPath, 'cthead1.iwi.cbor')
const testOutputFilePath = path.join(testOutputPath, 'wasm-test-cthead1.iwi.cbor')

const verifyImage = (t, image) => {
  t.is(image.imageType.dimension, 2, 'dimension')
  t.is(image.imageType.componentType, IntTypes.UInt8, 'componentType')
  t.is(image.imageType.pixelType, PixelTypes.RGB, 'pixelType')
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

test('Test reading an ITK Wasm file', async t => {
  const { couldRead, image } = await wasmReadImageNode(testInputFilePath)
  t.true(couldRead)
  verifyImage(t, image)
})

test('Test writing and reading an ITK Wasm file', async t => {
  const { couldRead, image } = await wasmReadImageNode(testInputFilePath)
  t.true(couldRead)
  const useCompression = false
  const { couldWrite } = await wasmWriteImageNode(image, testOutputFilePath, { useCompression })
  t.true(couldWrite)

  const { couldRead: couldReadBack, image: imageBack } = await wasmReadImageNode(testOutputFilePath)
  t.true(couldReadBack)
  verifyImage(t, imageBack)
})
