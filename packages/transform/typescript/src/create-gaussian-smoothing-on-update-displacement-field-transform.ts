// Generated file. To retain edits, remove this comment.

import {
  TransformList,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import CreateGaussianSmoothingOnUpdateDisplacementFieldTransformOptions from './create-gaussian-smoothing-on-update-displacement-field-transform-options.js'
import CreateGaussianSmoothingOnUpdateDisplacementFieldTransformResult from './create-gaussian-smoothing-on-update-displacement-field-transform-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Create a gaussian-smoothing-on-update-displacement-field spatial transformation.
 *
 * @param {CreateGaussianSmoothingOnUpdateDisplacementFieldTransformOptions} options - options object
 *
 * @returns {Promise<CreateGaussianSmoothingOnUpdateDisplacementFieldTransformResult>} - result object
 */
async function createGaussianSmoothingOnUpdateDisplacementFieldTransform(
  options: CreateGaussianSmoothingOnUpdateDisplacementFieldTransformOptions = {}
) : Promise<CreateGaussianSmoothingOnUpdateDisplacementFieldTransformResult> {

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
  if (options.dimension) {
    args.push('--dimension', options.dimension.toString())

  }
  if (options.parametersType) {
    args.push('--parameters-type', options.parametersType.toString())

  }

  const pipelinePath = 'create-gaussian-smoothing-on-update-displacement-field-transform'

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

export default createGaussianSmoothingOnUpdateDisplacementFieldTransform
