// Generated file. To retain edits, remove this comment.

import {
  Image,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import VectorMagnitudeOptions from './vector-magnitude-options.js'
import VectorMagnitudeResult from './vector-magnitude-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

/**
 * Generate a scalar magnitude image based on the input vector's norm.
 *
 * @param {Image} vectorImage - Input vector image
 * @param {VectorMagnitudeOptions} options - options object
 *
 * @returns {Promise<VectorMagnitudeResult>} - result object
 */
async function vectorMagnitude(
  vectorImage: Image,
  options: VectorMagnitudeOptions = {}
) : Promise<VectorMagnitudeResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.Image },
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.Image, data: vectorImage },
  ]

  const args = []
  // Inputs
  const vectorImageName = '0'
  args.push(vectorImageName)

  // Outputs
  const magnitudeImageName = '0'
  args.push(magnitudeImageName)

  // Options
  args.push('--memory-io')

  const pipelinePath = 'vector-magnitude'

  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl(), webWorker: options?.webWorker ?? null })
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    magnitudeImage: outputs[0]?.data as Image,
  }
  return result
}

export default vectorMagnitude
