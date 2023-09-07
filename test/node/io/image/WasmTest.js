import test from 'ava'
import path from 'path'

import { IntTypes, PixelTypes, getMatrixElement, readImageLocalFile, writeImageLocalFile } from '../../../../dist/index.js'

const testInputFilePath = path.resolve('build-emscripten', 'ExternalData', 'test', 'Input', 'cthead1.png')
const testOutputFilePath = path.resolve('build-emscripten', 'Testing', 'Temporary', 'TestWasm-cthead1.iwi.cbor')
const testZstdOutputFilePath = path.resolve('build-emscripten', 'Testing', 'Temporary', 'TestWasm-cthead1.iwi.cbor.zst')

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

test('Test writing and reading an ITK Wasm file', async (t) => {
  const image = await readImageLocalFile(testInputFilePath)
  await writeImageLocalFile(image, testOutputFilePath)
  const resultImage = await readImageLocalFile(testOutputFilePath)
  verifyImage(t, resultImage)
})

test('Test writing and reading a ZSTD compressed ITK Wasm file', async (t) => {
  const image = await readImageLocalFile(testInputFilePath)
  await writeImageLocalFile(image, testZstdOutputFilePath)
  const resultImage = await readImageLocalFile(testOutputFilePath)
  verifyImage(t, resultImage)
})
