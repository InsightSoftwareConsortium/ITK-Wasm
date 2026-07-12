// Generated file. To retain edits, remove this comment.

import {
  Image,
  TransformList,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import ResampleOptions from './resample-options.js'
import ResampleResult from './resample-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Resample an image onto an explicitly parameterized output grid with an optional transform and a selectable interpolator.
 *
 * @param {Image} input - The moving image to resample.
 * @param {ResampleOptions} options - options object
 *
 * @returns {Promise<ResampleResult>} - result object
 */
async function resample(
  input: Image,
  options: ResampleOptions = {}
) : Promise<ResampleResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.Image },
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.Image, data: input },
  ]

  const args = []
  // Inputs
  const inputName = '0'
  args.push(inputName)

  // Outputs
  const outputName = '0'
  args.push(outputName)

  // Options
  args.push('--memory-io')
  if (typeof options.size !== "undefined") {
    if(options.size.length < 1) {
      throw new Error('"size" option must have a length > 1')
    }
    args.push('--size')

    await Promise.all(options.size.map(async (value) => {
      args.push(value.toString())
    }))
  }
  if (typeof options.outputSpacing !== "undefined") {
    if(options.outputSpacing.length < 1) {
      throw new Error('"output-spacing" option must have a length > 1')
    }
    args.push('--output-spacing')

    await Promise.all(options.outputSpacing.map(async (value) => {
      args.push(value.toString())
    }))
  }
  if (typeof options.outputOrigin !== "undefined") {
    if(options.outputOrigin.length < 1) {
      throw new Error('"output-origin" option must have a length > 1')
    }
    args.push('--output-origin')

    await Promise.all(options.outputOrigin.map(async (value) => {
      args.push(value.toString())
    }))
  }
  if (typeof options.outputDirection !== "undefined") {
    if(options.outputDirection.length < 1) {
      throw new Error('"output-direction" option must have a length > 1')
    }
    args.push('--output-direction')

    await Promise.all(options.outputDirection.map(async (value) => {
      args.push(value.toString())
    }))
  }
  if (typeof options.transform !== "undefined") {
    const inputCountString = inputs.length.toString()
    inputs.push({ type: InterfaceTypes.TransformList, data: options.transform as TransformList })
    args.push('--transform', inputCountString)

  }
  if (typeof options.interpolator !== "undefined") {
    if (!['linear', 'nearest_neighbor', 'label_image', 'b_spline', 'windowed_sinc', 'gaussian'].includes(options.interpolator)) {
      throw new Error('"interpolator" option must be one of linear, nearest_neighbor, label_image, b_spline, windowed_sinc, gaussian')
    }
    args.push('--interpolator', options.interpolator.toString())

  }
  if (typeof options.defaultValue !== "undefined") {
    args.push('--default-value', options.defaultValue.toString())

  }

  const pipelinePath = 'resample'

  let workerToUse = options?.webWorker
  if (workerToUse === undefined) {
    workerToUse = await getDefaultWebWorker()
  }
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl(), webWorker: workerToUse, noCopy: options?.noCopy })
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    output: outputs[0]?.data as Image,
  }
  return result
}

export default resample
