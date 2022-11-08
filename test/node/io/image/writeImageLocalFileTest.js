import test from 'ava'
import path from 'path'

import { IntTypes, PixelTypes, getMatrixElement, readImageLocalFile, writeImageLocalFile } from '../../../../dist/index.js'

const testInputFilePath = path.resolve('build-emscripten', 'ExternalData', 'test', 'Input', 'cthead1.png')
const testOutputFilePath = path.resolve('build-emscripten', 'Testing', 'Temporary', 'writeImageLocalFileTest-cthead1.iwi.cbor')

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

test('writeImageLocalFile writes a file path on the local filesystem', async t => {
  const image = await readImageLocalFile(testInputFilePath)
  await writeImageLocalFile(image, testOutputFilePath)
  const imageSecondPass = await readImageLocalFile(testOutputFilePath)
  verifyImage(t, imageSecondPass)
})

test('writeImageLocalFile writes a file path on the local filesystem given componentType, pixelType', async t => {
  const image = await readImageLocalFile(testInputFilePath)
  const componentType = IntTypes.UInt16
  const pixelType = PixelTypes.Vector
  const outputFilePath = testOutputFilePath + 'componentTypePixelType.iwi.cbor'
  await writeImageLocalFile(image, outputFilePath, { componentType, pixelType })
  const imageSecondPass = await readImageLocalFile(outputFilePath)
  verifyImage(t, imageSecondPass, componentType, pixelType)
})
