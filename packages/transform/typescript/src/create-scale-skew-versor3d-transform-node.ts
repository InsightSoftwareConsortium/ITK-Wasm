// Generated file. To retain edits, remove this comment.

import {
  TransformList,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import CreateScaleSkewVersor3dTransformNodeOptions from './create-scale-skew-versor3d-transform-node-options.js'
import CreateScaleSkewVersor3dTransformNodeResult from './create-scale-skew-versor3d-transform-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Create a scale-skew-versor3d spatial transformation.
 *
 * @param {CreateScaleSkewVersor3dTransformNodeOptions} options - options object
 *
 * @returns {Promise<CreateScaleSkewVersor3dTransformNodeResult>} - result object
 */
async function createScaleSkewVersor3dTransformNode(
  options: CreateScaleSkewVersor3dTransformNodeOptions = {}
) : Promise<CreateScaleSkewVersor3dTransformNodeResult> {

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

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'create-scale-skew-versor3d-transform')

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

export default createScaleSkewVersor3dTransformNode
