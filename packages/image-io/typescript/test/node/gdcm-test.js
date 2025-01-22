import test from 'ava'
import path from 'path'

import { gdcmReadImageNode, gdcmWriteImageNode } from '../../dist/index-node.js'
import { IntTypes, PixelTypes, getMatrixElement } from 'itk-wasm'

import { testInputPath, testOutputPath } from './common.js'

const testInputFilePath = path.join(testInputPath, '1.3.6.1.4.1.5962.99.1.3814087073.479799962.1489872804257.100.0.dcm')
const testOutputFilePath = path.join(testOutputPath, '1.3.6.1.4.1.5962.99.1.3814087073.479799962.1489872804257.100.0.dcm')

const verifyImage = (t, image) => {
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
  t.is(getMatrixElement(image.direction, 3, 0, 0), 0.0, 'direction (0, 0)')
  t.is(getMatrixElement(image.direction, 3, 0, 1), 0.0, 'direction (0, 1)')
  t.is(getMatrixElement(image.direction, 3, 0, 2), -1.0, 'direction (0, 2)')
  t.is(getMatrixElement(image.direction, 3, 1, 0), 1.0, 'direction (1, 0)')
  t.is(getMatrixElement(image.direction, 3, 1, 1), 0.0, 'direction (1, 1)')
  t.is(getMatrixElement(image.direction, 3, 1, 2), 0.0, 'direction (1, 2)')
  t.is(image.size[0], 256, 'size[0]')
  t.is(image.size[1], 256, 'size[1]')
  t.is(image.size[2], 1, 'size[1]')
  t.is(image.data.length, 65536, 'data.length')
  t.is(image.data[1000], 3, 'data[1000]')
  t.is(image.metadata.get('0020|1040'), 'BRAIN ', 'tag metadata')
}

test('Test reading a DICOM file', async t => {
  const { couldRead, image } = await gdcmReadImageNode(testInputFilePath)
  t.true(couldRead)
  verifyImage(t, image)
})

test('Test writing a DICOM file', async t => {
  const { couldRead, image } = await gdcmReadImageNode(testInputFilePath)
  t.true(couldRead)
  const useCompression = false
  const { couldWrite } = await gdcmWriteImageNode(image, testOutputFilePath, { useCompression })
  t.true(couldWrite)

  const { couldRead: couldReadBack, image: imageBack } = await gdcmReadImageNode(testOutputFilePath)
  t.true(couldReadBack)
  verifyImage(t, imageBack)
})
