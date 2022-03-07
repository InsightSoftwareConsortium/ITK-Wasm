import test from 'ava'
import path from 'path'

import { IntTypes, PixelTypes, getMatrixElement, readImageLocalFile } from '../../../../dist/index.js'

test('Test reading a BMP file', t => {
  const testFilePath = path.resolve('build-emscripten', 'ExternalData', 'test', 'Input', 'image_color.bmp')
  return readImageLocalFile(testFilePath).then(function (image) {
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
    t.is(image.size[0], 31, 'size[0]')
    t.is(image.size[1], 31, 'size[1]')
    t.is(image.data.length, 2883, 'data.length')
    t.is(image.data[1000], 159, 'data[1000]')
  })
})
