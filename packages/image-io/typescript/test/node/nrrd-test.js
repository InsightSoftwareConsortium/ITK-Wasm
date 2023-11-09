import test from 'ava'
import path from 'path'

import { nrrdReadImageNode, nrrdWriteImageNode } from '../../dist/index-node.js'
import { FloatTypes, PixelTypes, getMatrixElement } from 'itk-wasm'

import { testInputPath, testOutputPath } from './common.js'

const testInputFilePath = path.join(testInputPath, 'vol-raw-little.nrrd')
const testOutputFilePath = path.join(testOutputPath, 'nrrd-test-vol-raw-little.nrrd')

const verifyImage = (t, image) => {
  t.is(image.imageType.dimension, 3, 'dimension')
  t.is(image.imageType.componentType, FloatTypes.Float64, 'componentType')
  t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
  t.is(image.imageType.components, 1, 'components')
  t.is(image.origin[0], 0.0, 'origin[0]')
  t.is(image.origin[1], 0.0, 'origin[1]')
  t.is(image.origin[2], 0.0, 'origin[2]')
  t.is(image.spacing[0], 1.0, 'spacing[0]')
  t.is(image.spacing[1], 1.0, 'spacing[1]')
  t.is(image.spacing[2], 1.0, 'spacing[2]')
  t.is(getMatrixElement(image.direction, 3, 0, 0), 1.0, 'direction (0, 0)')
  t.is(getMatrixElement(image.direction, 3, 0, 1), 0.0, 'direction (0, 1)')
  t.is(getMatrixElement(image.direction, 3, 0, 2), 0.0, 'direction (0, 2)')
  t.is(getMatrixElement(image.direction, 3, 1, 0), 0.0, 'direction (1, 0)')
  t.is(getMatrixElement(image.direction, 3, 1, 1), 1.0, 'direction (1, 1)')
  t.is(getMatrixElement(image.direction, 3, 1, 2), 0.0, 'direction (1, 2)')
  t.is(getMatrixElement(image.direction, 3, 2, 0), 0.0, 'direction (2, 0)')
  t.is(getMatrixElement(image.direction, 3, 2, 1), 0.0, 'direction (2, 1)')
  t.is(getMatrixElement(image.direction, 3, 2, 2), 1.0, 'direction (2, 2)')
  t.is(image.size[0], 5, 'size[0]')
  t.is(image.size[1], 6, 'size[1]')
  t.is(image.size[2], 7, 'size[2]')
  t.is(image.data.length, 210, 'data.length')
  t.is(image.data[2], 5.0, 'data[2]')
}

test('Test reading a NRRD file', async t => {
  const { couldRead, image } = await nrrdReadImageNode(testInputFilePath)
  t.true(couldRead)
  verifyImage(t, image)
})

test('Test writing a NRRD file', async t => {
  const { couldRead, image } = await nrrdReadImageNode(testInputFilePath)
  t.true(couldRead)
  const useCompression = false
  const { couldWrite } = await nrrdWriteImageNode(image, testOutputFilePath, { useCompression })
  t.true(couldWrite)

  const { couldRead: couldReadBack, image: imageBack } = await nrrdReadImageNode(testOutputFilePath)
  t.true(couldReadBack)
  verifyImage(t, imageBack)
})
