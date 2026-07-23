import test from 'ava'
import path from 'path'

import { tiffReadImageNode, tiffWriteImageNode, writeImageNode } from '../../dist/index-node.js'
import { IntTypes, PixelTypes, getMatrixElement } from 'itk-wasm'

import { testInputPath, testOutputPath } from './common.js'

const testInputFilePath = path.join(testInputPath, 'ShortTestImage.tiff')
const testOutputFilePath = path.join(testOutputPath, 'tiff-test-ShortTestImage.tiff')

const verifyImage = (t, image) => {
  t.is(image.imageType.dimension, 2, 'dimension')
  t.is(image.imageType.componentType, IntTypes.Int16, 'componentType')
  t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
  t.is(image.imageType.components, 1, 'components')
  t.is(image.origin[0], 0.0, 'origin[0]')
  t.is(image.origin[1], 0.0, 'origin[1]')
  // t.is(image.spacing[0], 1.0, 'spacing[0]')
  // t.is(image.spacing[1], 1.0, 'spacing[1]')
  t.is(getMatrixElement(image.direction, 2, 0, 0), 1.0, 'direction (0, 0)')
  t.is(getMatrixElement(image.direction, 2, 0, 1), 0.0, 'direction (0, 1)')
  t.is(getMatrixElement(image.direction, 2, 1, 0), 0.0, 'direction (1, 0)')
  t.is(getMatrixElement(image.direction, 2, 1, 1), 1.0, 'direction (1, 1)')
  t.is(image.size[0], 20, 'size[0]')
  t.is(image.size[1], 20, 'size[1]')
  t.is(image.data.length, 400, 'data.length')
  t.is(image.data[100], -9, 'data[100]')
}

test('Test reading a TIFF file', async t => {
  const { couldRead, image } = await tiffReadImageNode(testInputFilePath)
  t.true(couldRead)
  verifyImage(t, image)
})

test('Test writing a TIFF file', async t => {
  const { couldRead, image } = await tiffReadImageNode(testInputFilePath)
  t.true(couldRead)
  const useCompression = false
  const { couldWrite } = await tiffWriteImageNode(image, testOutputFilePath, { useCompression })
  t.true(couldWrite)

  const { couldRead: couldReadBack, image: imageBack } = await tiffReadImageNode(testOutputFilePath)
  t.true(couldReadBack)
  verifyImage(t, imageBack)
})


test('Test TIFF integer pixel types', async t => {
  const dtypes = [
      {componentType: 'uint8', data: new Uint8Array(100*100), name: 'uint8_test'},
      {componentType: 'uint16', data: new Uint16Array(100*100), name: 'uint16_test'},
      {componentType: 'uint32', data: new Uint32Array(100*100), name: 'uint32_test'},
  ]

  dtypes.forEach(async (d) => {
      console.log("Writing", d.name)

      const res = await writeImageNode(
          {
              imageType: {
                  dimension: 2,
                  pixelType: 'Scalar',
                  componentType: d.componentType,
                  components: 1
              },
              name: d.name,
              direction: new Float64Array([1.0, 0.0, 0.0, 1.0]),
              size: [100, 100],
              data: d.data, // <- !!! Will crash if Uint32Array
          },d.name + '.tif')

      console.log(d.name, res)
  })
})
