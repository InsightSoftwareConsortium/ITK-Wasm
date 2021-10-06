import test from 'ava'
import path from 'path'

import { FloatTypes, PixelTypes, readImageLocalFile } from '../../../dist/index.js'

test('Test reading a MINC file', t => {
  const testFilePath = path.resolve('build', 'ExternalData', 'test', 'Input', 't1_z+_short_cor.mnc')
  return readImageLocalFile(testFilePath).then(function (image) {
    t.is(image.imageType.dimension, 3, 'dimension')
    t.is(image.imageType.componentType, FloatTypes.Float32, 'componentType')
    t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
    t.is(image.imageType.components, 1, 'components')
    t.is(image.origin[0], -21.425182690867963, 'origin[0]')
    t.is(image.origin[1], 59.12510556251424, 'origin[1]')
    t.is(image.origin[2], -8.31768365930949, 'origin[2]')
    t.is(image.spacing[0], 1.0, 'spacing[0]')
    t.is(image.spacing[1], 1.0, 'spacing[1]')
    t.is(image.spacing[2], 1.2, 'spacing[2]')
    t.is(image.direction.getElement(0, 0), 0.9980212170406957, 'direction (0, 0)')
    t.is(image.direction.getElement(0, 1), -0.05172001539071517, 'direction (0, 1)')
    t.is(image.direction.getElement(0, 2), 0.03575998606925314, 'direction (0, 2)')
    t.is(image.direction.getElement(1, 0), 0.0523040113746069, 'direction (1, 0)')
    t.is(image.direction.getElement(1, 1), 0.9985092971339445, 'direction (1, 1)')
    t.is(image.direction.getElement(1, 2), -0.015601993922049426, 'direction (1, 2)')
    t.is(image.direction.getElement(2, 0), -0.034899007589522905, 'direction (2, 0)')
    t.is(image.direction.getElement(2, 1), 0.01744200519034907, 'direction (2, 1)')
    t.is(image.direction.getElement(2, 2), 0.9992386107341845, 'direction (2, 2)')
    t.is(image.size[0], 30, 'size[0]')
    t.is(image.size[1], 40, 'size[1]')
    t.is(image.size[2], 10, 'size[2]')
    t.is(image.data.length, 12000, 'data.length')
    t.is(image.data[1000], 7.437521934509277, 'data[1000]')
  })
})
