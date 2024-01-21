import test from 'ava'
import path from 'path'

import { readImageNode, writeImageNode } from '@itk-wasm/image-io'
import { compareImagesNode } from '@itk-wasm/compare-images'

import { downsampleLabelImageNode } from '../../dist/index-node.js'
import { testInputPath, testBaselinePath } from './common.js'

test('Test downsampleNode', async t => {
  const testInputFilePath = path.join(testInputPath, '2th_cthead1.png')
  const testBaselineFilePath = path.join(testBaselinePath, '2th_cthead1-downsample-label-image.nrrd')

  const image = await readImageNode(testInputFilePath)
  const { downsampled } = await downsampleLabelImageNode(image, { shrinkFactors: [2, 2] })
  const baseline = await readImageNode(testBaselineFilePath)

  const { metrics } = await compareImagesNode(downsampled, { baselineImages: [baseline, ] })

  t.true(metrics.almostEqual)
})
