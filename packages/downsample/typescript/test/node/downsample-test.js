import test from 'ava'
import path from 'path'

import { readImageNode } from '@itk-wasm/image-io'
import { compareImagesNode } from '@itk-wasm/compare-images'

import { downsampleNode, downsampleBinShrinkNode } from '../../dist/index-node.js'
import { testInputPath, testBaselinePath, arraysAlmostEqual } from './common.js'

test('Test downsampleNode', async t => {
  const testInputFilePath = path.join(testInputPath, 'cthead1.png')
  const testBaselineFilePath = path.join(testBaselinePath, 'cthead1-downsample.nrrd')

  const image = await readImageNode(testInputFilePath)
  const { downsampled } = await downsampleNode(image, { shrinkFactors: [2, 2] })
  const baseline = await readImageNode(testBaselineFilePath)

  const { metrics } = await compareImagesNode(downsampled, { baselineImages: [baseline, ] })

  t.true(metrics.almostEqual)
  // Downsampling shifts the origin to the coarse-grid pixel centers
  t.true(arraysAlmostEqual(downsampled.origin, [0.5, 0.5]), `origin was ${downsampled.origin}`)
  t.deepEqual(downsampled.spacing, [2, 2])
  t.deepEqual(downsampled.size, [128, 128])
})

test('Test downsampleNode origin matches downsampleBinShrinkNode', async t => {
  const testInputFilePath = path.join(testInputPath, 'cthead1.png')

  const image = await readImageNode(testInputFilePath)
  const { downsampled } = await downsampleNode(image, { shrinkFactors: [2, 2] })
  const { downsampled: binShrunk } = await downsampleBinShrinkNode(image, { shrinkFactors: [2, 2] })

  // Pin the itk::BinShrinkImageFilter grid convention, https://github.com/InsightSoftwareConsortium/ITK-Wasm/issues/1409
  t.deepEqual(downsampled.origin, binShrunk.origin)
  t.deepEqual(downsampled.spacing, binShrunk.spacing)
  t.deepEqual(downsampled.size, binShrunk.size)
})

test('Test downsampleNode cropRadius composes with the origin shift', async t => {
  const testInputFilePath = path.join(testInputPath, 'cthead1.png')

  const image = await readImageNode(testInputFilePath)
  const { downsampled } = await downsampleNode(image, {
    shrinkFactors: [2, 2],
    cropRadius: [8, 8]
  })

  t.true(arraysAlmostEqual(downsampled.origin, [8.5, 8.5]), `origin was ${downsampled.origin}`)
  t.deepEqual(downsampled.spacing, [2, 2])
  t.deepEqual(downsampled.size, [120, 120])
})
