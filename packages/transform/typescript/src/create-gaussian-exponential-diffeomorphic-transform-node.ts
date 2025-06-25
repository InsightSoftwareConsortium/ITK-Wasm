// Generated file. To retain edits, remove this comment.

import {
  TransformList,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import CreateGaussianExponentialDiffeomorphicTransformNodeOptions from './create-gaussian-exponential-diffeomorphic-transform-node-options.js'
import CreateGaussianExponentialDiffeomorphicTransformNodeResult from './create-gaussian-exponential-diffeomorphic-transform-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Create a gaussian-exponential-diffeomorphic spatial transformation.
 *
 * @param {CreateGaussianExponentialDiffeomorphicTransformNodeOptions} options - options object
 *
 * @returns {Promise<CreateGaussianExponentialDiffeomorphicTransformNodeResult>} - result object
 */
async function createGaussianExponentialDiffeomorphicTransformNode(
  options: CreateGaussianExponentialDiffeomorphicTransformNodeOptions = {}
) : Promise<CreateGaussianExponentialDiffeomorphicTransformNodeResult> {

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

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'create-gaussian-exponential-diffeomorphic-transform')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    transform: outputs[0]?.data as TransformList,
  }
  return result
}

export default createGaussianExponentialDiffeomorphicTransformNode
