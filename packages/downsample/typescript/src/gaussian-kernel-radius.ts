import {
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import GaussianKernelRadiusOptions from './gaussian-kernel-radius-options.js'
import GaussianKernelRadiusResult from './gaussian-kernel-radius-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Radius in pixels required for effective discrete gaussian filtering.
 *
 * @param {GaussianKernelRadiusOptions} options - options object
 *
 * @returns {Promise<GaussianKernelRadiusResult>} - result object
 */
async function gaussianKernelRadius(
  options: GaussianKernelRadiusOptions = { size: [1,1], sigma: [1,1], }
) : Promise<GaussianKernelRadiusResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
  ]

  const inputs: Array<PipelineInput> = [
  ]

  const args = []
  // Inputs
  // Outputs
  const radiusName = '0'
  args.push(radiusName)

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
  if (typeof options.sigma !== "undefined") {
    if(options.sigma.length < 1) {
      throw new Error('"sigma" option must have a length > 1')
    }
    args.push('--sigma')

    await Promise.all(options.sigma.map(async (value) => {
      args.push(value.toString())

    }))
  }
  if (typeof options.maxKernelWidth !== "undefined") {
    args.push('--max-kernel-width', options.maxKernelWidth.toString())

  }
  if (typeof options.maxKernelError !== "undefined") {
    args.push('--max-kernel-error', options.maxKernelError.toString())

  }

  const pipelinePath = 'gaussian-kernel-radius'

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
    radius: outputs[0]?.data as number[],
  }
  return result
}

export default gaussianKernelRadius
