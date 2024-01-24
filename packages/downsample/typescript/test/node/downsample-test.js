import test from 'ava'
import path from 'path'

import { readImageNode } from '@itk-wasm/image-io'
import { compareImagesNode } from '@itk-wasm/compare-images'

import { downsampleNode } from '../../dist/index-node.js'
import { testInputPath, testBaselinePath } from './common.js'

test('Test downsampleNode', async t => {
  const testInputFilePath = path.join(testInputPath, 'cthead1.png')
  const testBaselineFilePath = path.join(testBaselinePath, 'cthead1-downsample.nrrd')

  const image = await readImageNode(testInputFilePath)
  const { downsampled } = await downsampleNode(image, { shrinkFactors: [2, 2] })
  const baseline = await readImageNode(testBaselineFilePath)

  const { metrics } = await compareImagesNode(downsampled, { baselineImages: [baseline, ] })

  t.true(metrics.almostEqual)
})
