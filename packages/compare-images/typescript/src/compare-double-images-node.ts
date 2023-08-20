import {
  Image,
  JsonObject,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import CompareDoubleImagesOptions from './compare-double-images-options.js'
import CompareDoubleImagesNodeResult from './compare-double-images-node-result.js'
import CompareImagesMetric from './compare-images-metric.js'

import path from 'path'

/**
 * Compare double pixel type images with a tolerance for regression testing.
 *
 * @param {Image} testImage - The input test image
 * @param {CompareDoubleImagesOptions} options - options object
 *
 * @returns {Promise<CompareDoubleImagesNodeResult>} - result object
 */
async function compareDoubleImagesNode(
  testImage: Image,
  options: CompareDoubleImagesOptions = { baselineImages: [] as Image[], }
) : Promise<CompareDoubleImagesNodeResult> {

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

    options.baselineImages.forEach((value) => {
      const inputCountString = inputs.length.toString()
      inputs.push({ type: InterfaceTypes.Image, data: value as Image })
      args.push(inputCountString)

    })
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

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), '..', 'pipelines', 'compare-double-images')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0) {
    throw new Error(stderr)
  }

  const result = {
    metrics: (outputs[0].data as JsonObject).data as CompareImagesMetric,
    differenceImage: outputs[1].data as Image,
    differenceUchar2dImage: outputs[2].data as Image,
  }
  return result
}

export default compareDoubleImagesNode
