import test from 'ava'
import path from 'path'

import { compareDoubleImagesNode } from '../../dist/index-node.js'
import { readImageNode } from '@itk-wasm/image-io'

const inputPathPrefix = '../test/data/input/'

test('compareDoubleImagesNode produces the expected metrics and difference images', async t => {
  const testImageFile = 'cake_easy.iwi.cbor'
  const testImagePath = path.join(inputPathPrefix, testImageFile)
  const testImage = await readImageNode(testImagePath)

  const baselineImageFile = 'cake_hard.iwi.cbor'
  const baselineImagePath = path.join(inputPathPrefix, baselineImageFile)
  const baselineImage = await readImageNode(baselineImagePath)

  const { metrics, differenceImage, differenceUchar2dImage } = await compareDoubleImagesNode(testImage, { baselineImages: [baselineImage,] })

  t.is(metrics.almostEqual, false)
  t.is(metrics.numberOfPixelsWithDifferences, 9915)
  t.is(metrics.minimumDifference, 1.0)
  t.is(metrics.maximumDifference, 107.0)
  t.is(metrics.totalDifference, 337334.0)
  t.is(metrics.meanDifference, 34.02259203227433)

  t.is(differenceImage.imageType.componentType, 'float64')
  t.is(differenceUchar2dImage.imageType.componentType, 'uint8')
})
