import test from 'ava'
import path from 'path'
import fs from 'fs'

function mkdirP(dir) {
  try {
    fs.mkdirSync(dir, { recursive: true })
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

import { bioRadReadImageNode, bioRadWriteImageNode } from '../../dist/bundles/image-io-node.js'
import { IntTypes, PixelTypes, getMatrixElement } from 'itk-wasm'

const testInputFilePath = path.resolve('..', 'test', 'data', 'input', 'biorad.pic')
const testOutputPath = path.resolve('..', 'test', 'output', 'typescript')
const testOutputFilePath = path.join(testOutputPath, 'biorad.pic')

const verifyImage = (t, image) => {
  t.is(image.imageType.dimension, 2, 'dimension')
  t.is(image.imageType.componentType, IntTypes.UInt8, 'componentType')
  t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
  t.is(image.imageType.components, 1, 'components')
  t.is(image.origin[0], 0.0, 'origin[0]')
  t.is(image.origin[1], 0.0, 'origin[1]')
  t.is(image.spacing[0], 0.06000000238418579, 'spacing[0]')
  t.is(image.spacing[1], 0.06000000238418579, 'spacing[1]')
  t.is(getMatrixElement(image.direction, 2, 0, 0), 1.0, 'direction (0, 0)')
  t.is(getMatrixElement(image.direction, 2, 0, 1), 0.0, 'direction (0, 1)')
  t.is(getMatrixElement(image.direction, 2, 1, 0), 0.0, 'direction (1, 0)')
  t.is(getMatrixElement(image.direction, 2, 1, 1), 1.0, 'direction (1, 1)')
  t.is(image.size[0], 768, 'size[0]')
  t.is(image.size[1], 512, 'size[1]')
  t.is(image.data.length, 393216, 'data.length')
  t.is(image.data[1000], 27, 'data[1000]')
}

test('Test reading a BioRad file', async t => {
  const { couldRead, image } = await bioRadReadImageNode(testInputFilePath)
  t.true(couldRead)
  verifyImage(t, image)
})

test('Test writing a BioRad file', async t => {
  const { couldRead, image } = await bioRadReadImageNode(testInputFilePath)
  t.true(couldRead)
  const useCompression = false
  const { couldWrite, serializedImage } = await bioRadWriteImageNode(image,  { useCompression })
  console.log(couldWrite, serializedImage)

  // verifyImage(t, image)
  // return readImageLocalFile(testInputFilePath).then(function (image) {
  //   const useCompression = false
  //   return writeImageLocalFile(image, testOutputFilePath, useCompression)
  // })
  //   .then(function () {
  //     return readImageLocalFile(testOutputFilePath).then(function (image) {
  //       verifyImage(t, image)
  //     })
    // })
})
