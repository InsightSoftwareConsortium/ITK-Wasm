import {
  Image,
  JsonObject,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import CompareDoubleImagesOptions from './compare-double-images-options.js'
import CompareDoubleImagesResult from './compare-double-images-result.js'
import CompareImagesMetric from './compare-images-metric.js'


import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

/**
 * Compare double pixel type images with a tolerance for regression testing.
 *
 * @param {Image} testImage - The input test image
 * @param {CompareDoubleImagesOptions} options - options object
 *
 * @returns {Promise<CompareDoubleImagesResult>} - result object
 */
async function compareDoubleImages(
  webWorker: null | Worker,
  testImage: Image,
  options: CompareDoubleImagesOptions = { baselineImages: [] as Image[], }
) : Promise<CompareDoubleImagesResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonObject },
    { type: InterfaceTypes.Image },
    { type: InterfaceTypes.Image },
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.Image, data: testImage },
  ]

  const args = []
  // Inputs
  const testImageName = '0'
  args.push(testImageName as string)

  // Outputs
  const metricsName = '0'
  args.push(metricsName)

  const differenceImageName = '1'
  args.push(differenceImageName)

  const differenceUchar2dImageName = '2'
  args.push(differenceUchar2dImageName)

  // Options
  args.push('--memory-io')
  if (typeof options.baselineImages !== "undefined") {
    if(options.baselineImages.length < 1) {
      throw new Error('"baseline-images" option must have a length > 1')
    }
    args.push('--baseline-images')

    await Promise.all(options.baselineImages.map(async (value) => {
      const inputCountString = inputs.length.toString()
      inputs.push({ type: InterfaceTypes.Image, data: value as Image })
      args.push(inputCountString)

    }))
  }
  if (typeof options.differenceThreshold !== "undefined") {
    args.push('--difference-threshold', options.differenceThreshold.toString())

  }
  if (typeof options.radiusTolerance !== "undefined") {
    args.push('--radius-tolerance', options.radiusTolerance.toString())

  }
  if (typeof options.numberOfPixelsTolerance !== "undefined") {
    args.push('--number-of-pixels-tolerance', options.numberOfPixelsTolerance.toString())

  }
  if (typeof options.ignoreBoundaryPixels !== "undefined") {
    options.ignoreBoundaryPixels && args.push('--ignore-boundary-pixels')
  }

  const pipelinePath = 'compare-double-images'

  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl() })
  if (returnValue !== 0) {
    throw new Error(stderr)
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    metrics: (outputs[0].data as JsonObject).data as CompareImagesMetric,
    differenceImage: outputs[1].data as Image,
    differenceUchar2dImage: outputs[2].data as Image,
  }
  return result
}

export default compareDoubleImages
