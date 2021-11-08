import test from 'ava'
import path from 'path'

import { IntTypes, PixelTypes, getMatrixElement, readImageLocalFile } from '../../../dist/index.js'

test('Test reading a Scanco ISQ file', t => {
  const testFilePath = path.resolve('build', 'ExternalData', 'test', 'Input', 'C0004255.ISQ')
  return readImageLocalFile(testFilePath).then(function (image) {
    t.is(image.imageType.dimension, 3, 'dimension')
    t.is(image.imageType.componentType, IntTypes.Int16, 'componentType')
    t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
    t.is(image.imageType.components, 1, 'components')
    t.is(image.origin[0], 0.0, 'origin[0]')
    t.is(image.origin[1], 0.0, 'origin[1]')
    t.is(image.spacing[0], 0.036000000000000004, 'spacing[0]')
    t.is(image.spacing[1], 0.036000000000000004, 'spacing[1]')
    t.is(getMatrixElement(image.direction, 3, 0, 0), 1.0, 'direction (0, 0)')
    t.is(getMatrixElement(image.direction, 3, 0, 1), 0.0, 'direction (0, 1)')
    t.is(getMatrixElement(image.direction, 3, 1, 0), 0.0, 'direction (1, 0)')
    t.is(getMatrixElement(image.direction, 3, 1, 1), 1.0, 'direction (1, 1)')
    t.is(image.size[0], 1024, 'size[0]')
    t.is(image.size[1], 1024, 'size[1]')
    t.is(image.data.length, 53477376, 'data.length')
    t.is(image.data[100000], -292, 'data[100000]')
  })
})
