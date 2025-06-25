// Generated file. To retain edits, remove this comment.

import {
  TransformList,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import CreateEuler2dTransformNodeOptions from './create-euler2d-transform-node-options.js'
import CreateEuler2dTransformNodeResult from './create-euler2d-transform-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Create a euler2d spatial transformation.
 *
 * @param {CreateEuler2dTransformNodeOptions} options - options object
 *
 * @returns {Promise<CreateEuler2dTransformNodeResult>} - result object
 */
async function createEuler2dTransformNode(
  options: CreateEuler2dTransformNodeOptions = {}
) : Promise<CreateEuler2dTransformNodeResult> {

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

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'create-euler2d-transform')

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

export default createEuler2dTransformNode
