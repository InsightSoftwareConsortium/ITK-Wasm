// Generated file. To retain edits, remove this comment.

import {
  TransformList,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import CreateSimilarity2dTransformNodeOptions from './create-similarity2d-transform-node-options.js'
import CreateSimilarity2dTransformNodeResult from './create-similarity2d-transform-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Create a similarity2d spatial transformation.
 *
 * @param {CreateSimilarity2dTransformNodeOptions} options - options object
 *
 * @returns {Promise<CreateSimilarity2dTransformNodeResult>} - result object
 */
async function createSimilarity2dTransformNode(
  options: CreateSimilarity2dTransformNodeOptions = {}
) : Promise<CreateSimilarity2dTransformNodeResult> {

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

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'create-similarity2d-transform')

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

export default createSimilarity2dTransformNode
