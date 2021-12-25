import test from 'ava'
import path from 'path'

import { IntTypes, PixelTypes, getMatrixElement, readImageLocalFile } from '../../../../dist/index.js'

const testFilePath = path.resolve('build', 'ExternalData', 'test', 'Input', 'cthead1.png')

test('readImageLocalFile reads a file path given on the local filesystem', t => {
  return readImageLocalFile(testFilePath).then(function (image) {
    t.is(image.imageType.dimension, 2)
    t.is(image.imageType.componentType, IntTypes.UInt8)
    t.is(image.imageType.pixelType, PixelTypes.RGB)
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
  })
})
