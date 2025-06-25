// Generated file. To retain edits, remove this comment.

import {
  TransformList,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import CreateVersorTransformOptions from './create-versor-transform-options.js'
import CreateVersorTransformResult from './create-versor-transform-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Create a versor spatial transformation.
 *
 * @param {CreateVersorTransformOptions} options - options object
 *
 * @returns {Promise<CreateVersorTransformResult>} - result object
 */
async function createVersorTransform(
  options: CreateVersorTransformOptions = {}
) : Promise<CreateVersorTransformResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.TransformList },
  ]

  const inputs: Array<PipelineInput> = [
  ]

  const args = []
  // Inputs
  // Outputs
  const transformName = '0'
  args.push(transformName)

  // Options
  args.push('--memory-io')
  if (options.parametersType) {
    args.push('--parameters-type', options.parametersType.toString())

  }

  const pipelinePath = 'create-versor-transform'

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
    transform: outputs[0]?.data as TransformList,
  }
  return result
}

export default createVersorTransform
