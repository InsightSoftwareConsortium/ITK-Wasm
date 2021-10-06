import test from 'ava'
import path from 'path'

import { IntTypes, PixelTypes, readImageLocalFile, readDICOMTagsLocalFile } from '../../../dist/index.js'

test('Test reading a DICOM file', t => {
  const testFilePath = path.resolve('build', 'ExternalData', 'test', 'Input', '1.3.6.1.4.1.5962.99.1.3814087073.479799962.1489872804257.100.0.dcm')
  return readImageLocalFile(testFilePath).then(function (image) {
    t.is(image.imageType.dimension, 3, 'dimension')
    t.is(image.imageType.componentType, IntTypes.Int16, 'componentType')
    t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
    t.is(image.imageType.components, 1, 'components')
    t.is(image.origin[0], -32.9551, 'origin[0]')
    t.is(image.origin[1], -133.9286, 'origin[1]')
    t.is(image.origin[2], 116.7857, 'origin[2]')
    t.is(image.spacing[0], 1.0, 'spacing[0]')
    t.is(image.spacing[1], 1.0, 'spacing[1]')
    t.is(image.spacing[2], 1.0, 'spacing[2]')
    t.is(image.direction.getElement(0, 0), 0.0, 'direction (0, 0)')
    t.is(image.direction.getElement(0, 1), 0.0, 'direction (0, 1)')
    t.is(image.direction.getElement(0, 2), -1.0, 'direction (0, 2)')
    t.is(image.direction.getElement(1, 0), 1.0, 'direction (1, 0)')
    t.is(image.direction.getElement(1, 1), 0.0, 'direction (1, 1)')
    t.is(image.direction.getElement(1, 2), 0.0, 'direction (1, 2)')
    t.is(image.direction.getElement(2, 0), 0.0, 'direction (2, 0)')
    t.is(image.direction.getElement(2, 1), -1.0, 'direction (2, 1)')
    t.is(image.direction.getElement(2, 2), 0.0, 'direction (2, 2)')
    t.is(image.size[0], 256, 'size[0]')
    t.is(image.size[1], 256, 'size[1]')
    t.is(image.size[2], 1, 'size[2]')
    t.is(image.data.length, 65536, 'data.length')
    t.is(image.data[1000], 3, 'data[1000]')
  })
})

test('Test reading DICOM tags', async t => {
  const testFilePath = path.resolve('build', 'ExternalData', 'test', 'Input', '1.3.6.1.4.1.5962.99.1.3814087073.479799962.1489872804257.100.0.dcm')
  const expected = {
    '0010|0020': 'NOID',
    '0020|0032': '-3.295510e+01\\-1.339286e+02\\1.167857e+02',
    '0020|0037': '0.00000e+00\\ 1.00000e+00\\-0.00000e+00\\-0.00000e+00\\ 0.00000e+00\\-1.00000e+00',
    // case sensitivity test
    '0008|103e': 'SAG/RF-FAST/VOL/FLIP 30 ',
    '0008|103E': 'SAG/RF-FAST/VOL/FLIP 30 '
  }
  const result = await readDICOMTagsLocalFile(testFilePath, Object.keys(expected))

  t.true(result instanceof Map)
  Object.keys(expected).forEach((tag) => {
    t.is(result.get(tag), expected[tag], tag)
  })
})
