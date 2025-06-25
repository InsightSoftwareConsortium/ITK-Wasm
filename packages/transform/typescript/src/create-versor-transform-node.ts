// Generated file. To retain edits, remove this comment.

import {
  TransformList,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import CreateVersorTransformNodeOptions from './create-versor-transform-node-options.js'
import CreateVersorTransformNodeResult from './create-versor-transform-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Create a versor spatial transformation.
 *
 * @param {CreateVersorTransformNodeOptions} options - options object
 *
 * @returns {Promise<CreateVersorTransformNodeResult>} - result object
 */
async function createVersorTransformNode(
  options: CreateVersorTransformNodeOptions = {}
) : Promise<CreateVersorTransformNodeResult> {

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

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'create-versor-transform')

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

export default createVersorTransformNode
