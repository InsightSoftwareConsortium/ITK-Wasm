// Generated file. To retain edits, remove this comment.

import {
  JsonCompatible,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import DownsampleSigmaOptions from './downsample-sigma-options.js'
import DownsampleSigmaResult from './downsample-sigma-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Compute gaussian kernel sigma values in pixel units for downsampling.
 *
 * @param {DownsampleSigmaOptions} options - options object
 *
 * @returns {Promise<DownsampleSigmaResult>} - result object
 */
async function downsampleSigma(
  options: DownsampleSigmaOptions = { shrinkFactors: [2,2], }
) : Promise<DownsampleSigmaResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
  ]

  const inputs: Array<PipelineInput> = [
  ]

  const args = []
  // Inputs
  // Outputs
  const sigmaName = '0'
  args.push(sigmaName)

  // Options
  args.push('--memory-io')
  if (typeof options.shrinkFactors !== "undefined") {
    if(options.shrinkFactors.length < 1) {
      throw new Error('"shrink-factors" option must have a length > 1')
    }
    args.push('--shrink-factors')

    await Promise.all(options.shrinkFactors.map(async (value) => {
      args.push(value.toString())

    }))
  }

  const pipelinePath = 'downsample-sigma'

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
    sigma: outputs[0]?.data as JsonCompatible,
  }
  return result
}

export default downsampleSigma
