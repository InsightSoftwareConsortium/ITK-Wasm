import test from 'ava'
import path from 'path'

import { tiffReadImageNode, tiffWriteImageNode } from '../../dist/index-node.js'
import { IntTypes, PixelTypes, getMatrixElement, Image, ImageType } from 'itk-wasm'

import { testInputPath, testOutputPath } from './common.js'

const testInputFilePath = path.join(testInputPath, 'ShortTestImage.tiff')
const testOutputFilePath = path.join(testOutputPath, 'tiff-test-ShortTestImage.tiff')

const verifyImage = (t, image) => {
  t.is(image.imageType.dimension, 2, 'dimension')
  t.is(image.imageType.componentType, IntTypes.Int16, 'componentType')
  t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
  t.is(image.imageType.components, 1, 'components')
  t.is(image.origin[0], 0.0, 'origin[0]')
  t.is(image.origin[1], 0.0, 'origin[1]')
  // t.is(image.spacing[0], 1.0, 'spacing[0]')
  // t.is(image.spacing[1], 1.0, 'spacing[1]')
  t.is(getMatrixElement(image.direction, 2, 0, 0), 1.0, 'direction (0, 0)')
  t.is(getMatrixElement(image.direction, 2, 0, 1), 0.0, 'direction (0, 1)')
  t.is(getMatrixElement(image.direction, 2, 1, 0), 0.0, 'direction (1, 0)')
  t.is(getMatrixElement(image.direction, 2, 1, 1), 1.0, 'direction (1, 1)')
  t.is(image.size[0], 20, 'size[0]')
  t.is(image.size[1], 20, 'size[1]')
  t.is(image.data.length, 400, 'data.length')
  t.is(image.data[100], -9, 'data[100]')
}

test('Test reading a TIFF file', async t => {
  const { couldRead, image } = await tiffReadImageNode(testInputFilePath)
  t.true(couldRead)
  verifyImage(t, image)
})

test('Test writing a TIFF file', async t => {
  const { couldRead, image } = await tiffReadImageNode(testInputFilePath)
  t.true(couldRead)
  const useCompression = false
  const { couldWrite } = await tiffWriteImageNode(image, testOutputFilePath, { useCompression })
  t.true(couldWrite)

  const { couldRead: couldReadBack, image: imageBack } = await tiffReadImageNode(testOutputFilePath)
  t.true(couldReadBack)
  verifyImage(t, imageBack)
})

// Round-trip a scalar image whose component type is written and read back with
// full fidelity. Sample values intentionally exceed the 16-bit range so the
// 32-bit integer cases genuinely exercise 32-bit storage.
const roundTripScalar = async (t, componentType, TypedArrayConstructor, sample) => {
  const dimension = 2
  const size = [4, 3]
  const image = new Image(new ImageType(dimension, componentType, PixelTypes.Scalar, 1))
  image.size = size
  const length = size[0] * size[1]
  image.data = new TypedArrayConstructor(length)
  for (let index = 0; index < length; index++) {
    image.data[index] = sample(index)
  }

  const outputFilePath = path.join(testOutputPath, `tiff-roundtrip-${componentType}.tiff`)
  const { couldWrite } = await tiffWriteImageNode(image, outputFilePath)
  t.true(couldWrite, `couldWrite ${componentType}`)

  const { couldRead, image: imageBack } = await tiffReadImageNode(outputFilePath)
  t.true(couldRead, `couldRead ${componentType}`)
  t.is(imageBack.imageType.componentType, componentType, 'componentType')
  t.is(imageBack.data.length, length, 'data.length')
  for (let index = 0; index < length; index++) {
    t.is(Number(imageBack.data[index]), Number(image.data[index]), `data[${index}]`)
  }
}

// https://github.com/InsightSoftwareConsortium/ITK-Wasm/issues/1544
test('Round-trip a uint32 scalar TIFF file', async t => {
  await roundTripScalar(t, IntTypes.UInt32, Uint32Array, index => (index * 100003 + 70000) >>> 0)
})

test('Round-trip an int32 scalar TIFF file', async t => {
  await roundTripScalar(t, IntTypes.Int32, Int32Array, index => (index % 2 ? -1 : 1) * (index * 100003 + 70000))
})
