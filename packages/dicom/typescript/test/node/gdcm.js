import test from 'ava'
import path from 'path'
import glob from 'glob'

import { IntTypes, PixelTypes, getMatrixElement } from 'itk-wasm'
import { readImageDicomFileSeriesNode, readDicomTagsNode } from '../../dist/bundles/dicom-node.js'

const testDataInputDirectory = path.resolve('..', 'test', 'data', 'input')
const testSeriesDirectory = path.resolve(testDataInputDirectory, 'DicomImageOrientationTest')
const testDicomSeriesFiles = glob.sync(`${testSeriesDirectory}/*.dcm`)

function verifyImage (t, image, expectedComponentType, expectedPixelType) {
  let componentType = IntTypes.Int16
  if (expectedComponentType) {
    componentType = expectedComponentType
  }
  let pixelType = PixelTypes.Scalar
  if (expectedPixelType) {
    pixelType = expectedPixelType
  }
  t.is(image.imageType.dimension, 3, 'dimension')
  t.is(image.imageType.componentType, componentType, 'componentType')
  t.is(image.imageType.pixelType, pixelType, 'pixelType')
  t.is(image.imageType.components, 1, 'components')
  t.is(image.origin[0], -17.3551, 'origin[0]')
  t.is(image.origin[1], -133.9286, 'origin[1]')
  t.is(image.origin[2], 116.7857, 'origin[2]')
  t.is(image.spacing[0], 1.0, 'spacing[0]')
  t.is(image.spacing[1], 1.0, 'spacing[1]')
  t.is(image.spacing[2], 1.3000000000000007, 'spacing[2]')
  t.is(getMatrixElement(image.direction, 3, 0, 0), 0.0, 'direction (0, 0)')
  t.is(getMatrixElement(image.direction, 3, 0, 1), 0.0, 'direction (0, 1)')
  t.is(getMatrixElement(image.direction, 3, 0, 2), -1.0, 'direction (0, 2)')
  t.is(getMatrixElement(image.direction, 3, 1, 0), 1.0, 'direction (1, 0)')
  t.is(getMatrixElement(image.direction, 3, 1, 1), 0.0, 'direction (1, 1)')
  t.is(getMatrixElement(image.direction, 3, 1, 2), 0.0, 'direction (1, 2)')
  t.is(getMatrixElement(image.direction, 3, 2, 0), 0.0, 'direction (2, 0)')
  t.is(getMatrixElement(image.direction, 3, 2, 1), -1.0, 'direction (2, 1)')
  t.is(getMatrixElement(image.direction, 3, 2, 2), 0.0, 'direction (2, 2)')
  t.is(image.size[0], 256, 'size[0]')
  t.is(image.size[1], 256, 'size[1]')
  t.is(image.size[2], 3, 'size[2]')
  t.is(image.data.length, 3 * 65536, 'data.length')
  t.is(image.data[1000], 5, 'data[1000]')
}

test('Test reading a DICOM file', async t => {
  const { outputImage: image, sortedFilenames } = await readImageDicomFileSeriesNode({ inputImages: testDicomSeriesFiles })
  verifyImage(t, image)
  t.assert(sortedFilenames.length === 3)
  t.assert(sortedFilenames[0].includes('1.dcm'))
  t.assert(sortedFilenames[1].includes('2.dcm'))
  t.assert(sortedFilenames[2].includes('3.dcm'))
})

test('Test reading a DICOM file assume sorted', async t => {
  const singleSortedSeries = true
  const { outputImage: image, sortedFilenames } = await readImageDicomFileSeriesNode({ inputImages: testDicomSeriesFiles, singleSortedSeries })
  verifyImage(t, image)
  t.assert(sortedFilenames.length === 3)
  t.assert(sortedFilenames[0].includes('1.dcm'))
  t.assert(sortedFilenames[1].includes('2.dcm'))
  t.assert(sortedFilenames[2].includes('3.dcm'))
})

test('Test reading DICOM tags', async t => {
  const testFilePath = path.resolve(testDataInputDirectory, '1.3.6.1.4.1.5962.99.1.3814087073.479799962.1489872804257.100.0.dcm')
  const expected = {
    '0010|0020': 'NOID',
    '0020|0032': '-3.295510e+01\\-1.339286e+02\\1.167857e+02',
    '0020|0037': '0.00000e+00\\ 1.00000e+00\\-0.00000e+00\\-0.00000e+00\\ 0.00000e+00\\-1.00000e+00',
    // case sensitivity test
    '0008|103e': 'SAG/RF-FAST/VOL/FLIP 30 ',
    '0008|103E': 'SAG/RF-FAST/VOL/FLIP 30 '
  }
  const result = await readDicomTagsNode(testFilePath, { tagsToRead: { tags: Object.keys(expected) }})

  t.true(result.tags instanceof Array)
  const tagMap = new Map(result.tags)
  Object.keys(expected).forEach((tag) => {
    t.is(tagMap.get(tag), expected[tag], tag)
  })
})

test('Test reading all DICOM tags', async t => {
  const testFilePath = path.resolve(testDataInputDirectory, '1.3.6.1.4.1.5962.99.1.3814087073.479799962.1489872804257.100.0.dcm')
  const expected = {
    '0010|0020': 'NOID',
    '0020|0032': '-3.295510e+01\\-1.339286e+02\\1.167857e+02',
    '0020|0037': '0.00000e+00\\ 1.00000e+00\\-0.00000e+00\\-0.00000e+00\\ 0.00000e+00\\-1.00000e+00',
    '0008|103e': 'SAG/RF-FAST/VOL/FLIP 30 '
  }
  const result = await readDicomTagsNode(testFilePath)

  t.true(result.tags instanceof Array)
  const tagMap = new Map(result.tags)
  Object.keys(expected).forEach((tag) => {
    t.is(tagMap.get(tag), expected[tag], tag)
  })
  t.is(result.tags.length, 73, 'Number of tags')
})
