import test from 'ava'
import path from 'path'

import { IntTypes, PixelTypes, getMatrixElement, readImageLocalFile } from '../../../../dist/index.js'

const testFilePath = path.resolve('build-emscripten', 'ExternalData', 'test', 'Input', 'cthead1.png')

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

test('readImageLocalFile reads a file path given on the local filesystem', async t => {
  const image = await readImageLocalFile(testFilePath)
  const componentType = IntTypes.UInt8
  const pixelType = PixelTypes.RGB
  verifyImage(t, image, componentType, pixelType)
})

test('readImageLocalFile casts to the specified componentType', async t => {
  const componentType = IntTypes.UInt16
  const image = await readImageLocalFile(testFilePath, { componentType })
  const pixelType = PixelTypes.RGB
  verifyImage(t, image, componentType, pixelType)
})

test('readImageLocalFile casts to the specified pixelType', async t => {
  const pixelType = PixelTypes.Vector
  const image = await readImageLocalFile(testFilePath, { pixelType })
  const componentType = IntTypes.UInt8
  verifyImage(t, image, componentType, pixelType)
})
