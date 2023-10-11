import test from 'ava'
import path from 'path'

import { niftiReadImageNode, niftiWriteImageNode } from '../../dist/bundles/image-io-node.js'
import { FloatTypes, PixelTypes, getMatrixElement } from 'itk-wasm'

import { testInputPath, testOutputPath } from './common.js'

const testInputFilePath = path.join(testInputPath, 'r16slice.nii.gz')
const testOutputFilePath = path.join(testOutputPath, 'nifti-test-r16slice.nii.gz')

const verifyImage = (t, image) => {
  t.is(image.imageType.dimension, 2, 'dimension')
  t.is(image.imageType.componentType, FloatTypes.Float32, 'componentType')
  t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
  t.is(image.imageType.components, 1, 'components')
  t.is(image.origin[0], 0.0, 'origin[0]')
  t.is(image.origin[1], 0.0, 'origin[1]')
  t.is(image.spacing[0], 1.0, 'spacing[0]')
  t.is(image.spacing[1], 1.0, 'spacing[1]')
  t.is(image.size[0], 256, 'size[0]')
  t.is(image.size[1], 256, 'size[1]')
  t.is(image.data.length, 65536, 'data.length')
}

test('Test reading a Nifti file', async t => {
  const { couldRead, image } = await niftiReadImageNode(testInputFilePath)
  t.true(couldRead)
  verifyImage(t, image)
})

test('Test writing a Nifti file', async t => {
  const { couldRead, image } = await niftiReadImageNode(testInputFilePath)
  t.true(couldRead)
  const { couldWrite } = await niftiWriteImageNode(image, testOutputFilePath)
  t.true(couldWrite)
  const { couldRead: couldReadBack, image: imageBack } = await niftiReadImageNode(testOutputFilePath)
  t.true(couldReadBack)
  verifyImage(t, imageBack)
})
