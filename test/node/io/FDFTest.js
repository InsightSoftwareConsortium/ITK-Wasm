import test from 'ava'
import path from 'path'

import { FloatTypes, PixelTypes, getMatrixElement, readImageLocalFile } from '../../../dist/index.js'

test('Test reading a FDF file', t => {
  const testFilePath = path.resolve('test', 'Input', 'test.fdf')
  return readImageLocalFile(testFilePath).then(function (image) {
    t.is(image.imageType.dimension, 2, 'dimension')
    t.is(image.imageType.componentType, FloatTypes.Float32, 'componentType')
    t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
    t.is(image.imageType.components, 1, 'components')
    t.is(image.origin[0], 0.0, 'origin[0]')
    t.is(image.origin[1], 0.0, 'origin[1]')
    t.is(image.spacing[0], 0.15625, 'spacing[0]')
    t.is(image.spacing[1], 0.17578125, 'spacing[1]')
    t.is(getMatrixElement(image.direction, 2, 0, 0), 1.0, 'direction (0, 0)')
    t.is(getMatrixElement(image.direction, 2, 0, 1), 0.0, 'direction (0, 1)')
    t.is(getMatrixElement(image.direction, 2, 1, 0), 0.0, 'direction (1, 0)')
    t.is(getMatrixElement(image.direction, 2, 1, 1), 1.0, 'direction (1, 1)')
    t.is(image.size[0], 256, 'size[0]')
    t.is(image.size[1], 256, 'size[1]')
    t.is(image.data.length, 65536, 'data.length')
    t.is(image.data[1000], 2.1256876793475865e-16, 'data[1000]')
  })
})
