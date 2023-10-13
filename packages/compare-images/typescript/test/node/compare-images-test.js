import test from 'ava'
import path from 'path'

import { compareImagesNode } from '../../dist/index-node.js'
import { readImageNode } from '@itk-wasm/image-io'

const inputPathPrefix = '../test/data/input/'

test('compareImagesNode produces the expected metrics and difference images for uint8 inputs', async t => {
  const testImageFile = 'cake_easy.png'
  const testImagePath = path.join(inputPathPrefix, testImageFile)
  const testImage = await readImageNode(testImagePath)

  const baselineImageFile = 'cake_hard.png'
  const baselineImagePath = path.join(inputPathPrefix, baselineImageFile)
  const baselineImage = await readImageNode(baselineImagePath)

  const { metrics, differenceImage, differenceUchar2dImage } = await compareImagesNode(testImage, { baselineImages: [baselineImage,] })

  t.is(metrics.almostEqual, false)
  t.is(metrics.numberOfPixelsWithDifferences, 9915)
  t.is(metrics.minimumDifference, 1.0)
  t.is(metrics.maximumDifference, 107.0)
  t.is(metrics.totalDifference, 337334.0)
  t.is(metrics.meanDifference, 34.02259203227433)

  t.is(differenceImage.imageType.componentType, 'float64')
  t.is(differenceUchar2dImage.imageType.componentType, 'uint8')
})

test('compareImagesNode produces the expected metrics and difference images for rgb inputs', async t => {
  const testImageFile = 'apple.jpg'
  const testImagePath = path.join(inputPathPrefix, testImageFile)
  const testImage = await readImageNode(testImagePath)

  const baselineImageFile = 'orange.jpg'
  const baselineImagePath = path.join(inputPathPrefix, baselineImageFile)
  const baselineImage = await readImageNode(baselineImagePath)

  const { metrics, differenceImage, differenceUchar2dImage } = await compareImagesNode(testImage, { baselineImages: [baselineImage,] })

  t.is(metrics.almostEqual, false)
  t.is(metrics.numberOfPixelsWithDifferences, 26477)
  t.is(metrics.minimumDifference, 0.002273026683894841)
  t.is(metrics.maximumDifference, 312.2511648746159)
  t.is(metrics.totalDifference, 3121703.1639738297)
  t.is(metrics.meanDifference, 117.90244982338746)

  t.is(differenceImage.imageType.componentType, 'float64')
  t.is(differenceUchar2dImage.imageType.componentType, 'uint8')
})
