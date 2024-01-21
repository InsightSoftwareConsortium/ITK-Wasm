// Generated file. To retain edits, remove this comment.

import {
  Image,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import DownsampleOptions from './downsample-options.js'
import DownsampleResult from './downsample-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Apply a smoothing anti-alias filter and subsample the input image.
 *
 * @param {Image} input - Input image
 * @param {DownsampleOptions} options - options object
 *
 * @returns {Promise<DownsampleResult>} - result object
 */
async function downsample(
  input: Image,
  options: DownsampleOptions = { shrinkFactors: [2,2], }
) : Promise<DownsampleResult> {

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
  const downsampledName = '0'
  args.push(downsampledName)

  // Options
  args.push('--memory-io')
  if (typeof options.shrinkFactors !== "undefined") {
    if(options.shrinkFactors.length < 2) {
      throw new Error('"shrink-factors" option must have a length > 2')
    }
    args.push('--shrink-factors')

    await Promise.all(options.shrinkFactors.map(async (value) => {
      args.push(value.toString())

    }))
  }
  if (typeof options.cropRadius !== "undefined") {
    if(options.cropRadius.length < 2) {
      throw new Error('"crop-radius" option must have a length > 2')
    }
    args.push('--crop-radius')

    await Promise.all(options.cropRadius.map(async (value) => {
      args.push(value.toString())

    }))
  }

  const pipelinePath = 'downsample'

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
    downsampled: outputs[0]?.data as Image,
  }
  return result
}

export default downsample
