import test from 'ava'
import path from 'path'

import { hdf5ReadImageNode } from '../../dist/index-node.js'
import { IntTypes, PixelTypes, getMatrixElement } from 'itk-wasm'

import { testInputPath } from './common.js'

const testInputFilePath = path.join(testInputPath, 'ITKImage.hdf5')

test('Test reading a HDF5 file', async t => {
  const { couldRead, image } = await hdf5ReadImageNode(testInputFilePath)
  t.true(couldRead)
  t.is(image.imageType.dimension, 3, 'dimension')
  t.is(image.imageType.componentType, IntTypes.UInt8, 'componentType')
  t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
  t.is(image.imageType.components, 1, 'components')
  t.is(image.origin[0], 0, 'origin[0]')
  t.is(image.origin[1], 5, 'origin[1]')
  t.is(image.origin[2], 10, 'origin[2]')
  t.is(image.spacing[0], 1, 'spacing[0]')
  t.is(image.spacing[1], 2, 'spacing[1]')
  t.is(image.spacing[2], 3, 'spacing[2]')
  t.is(getMatrixElement(image.direction, 3, 0, 0), 0.866025403784439, 'direction (0, 0)')
  t.is(getMatrixElement(image.direction, 3, 0, 1), -0.5, 'direction (0, 1)')
  t.is(getMatrixElement(image.direction, 3, 0, 2), 0.0, 'direction (0, 2)')
  t.is(getMatrixElement(image.direction, 3, 1, 0), 0.5, 'direction (1, 0)')
  t.is(getMatrixElement(image.direction, 3, 1, 1), 0.866025403784439, 'direction (1, 1)')
  t.is(getMatrixElement(image.direction, 3, 1, 2), 0, 'direction (1, 2)')
  t.is(getMatrixElement(image.direction, 3, 2, 0), 0.0, 'direction (2, 0)')
  t.is(getMatrixElement(image.direction, 3, 2, 1), 0.0, 'direction (2, 1)')
  t.is(getMatrixElement(image.direction, 3, 2, 2), 1.0, 'direction (2, 2)')
  t.is(image.size[0], 5, 'size[0]')
  t.is(image.size[1], 5, 'size[1]')
  t.is(image.size[2], 5, 'size[2]')
  t.is(image.data.length, 125, 'data.length')
  t.is(image.data[10], 132, 'data[10]')
})
