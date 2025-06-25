// Generated file. To retain edits, remove this comment.

import {
  TransformList,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import CreateEuler3dTransformNodeOptions from './create-euler3d-transform-node-options.js'
import CreateEuler3dTransformNodeResult from './create-euler3d-transform-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Create a euler3d spatial transformation.
 *
 * @param {CreateEuler3dTransformNodeOptions} options - options object
 *
 * @returns {Promise<CreateEuler3dTransformNodeResult>} - result object
 */
async function createEuler3dTransformNode(
  options: CreateEuler3dTransformNodeOptions = {}
) : Promise<CreateEuler3dTransformNodeResult> {

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

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'create-euler3d-transform')

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

export default createEuler3dTransformNode
