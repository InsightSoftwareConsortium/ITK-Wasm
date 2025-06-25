// Generated file. To retain edits, remove this comment.

import {
  TransformList,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import CreateCompositeTransformNodeOptions from './create-composite-transform-node-options.js'
import CreateCompositeTransformNodeResult from './create-composite-transform-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Create a composite spatial transformation.
 *
 * @param {CreateCompositeTransformNodeOptions} options - options object
 *
 * @returns {Promise<CreateCompositeTransformNodeResult>} - result object
 */
async function createCompositeTransformNode(
  options: CreateCompositeTransformNodeOptions = {}
) : Promise<CreateCompositeTransformNodeResult> {

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

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'create-composite-transform')

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

export default createCompositeTransformNode
