// Generated file. To retain edits, remove this comment.

import {
  TransformList,
  JsonCompatible,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import AffineOpsNodeResult from './affine-ops-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Apply operations to an affine transform
 *
 * @param {TransformList} inputTransform - The input affine transform
 * @param {JsonCompatible} operations - JSON array of operations to apply
 *
 * @returns {Promise<AffineOpsNodeResult>} - result object
 */
async function affineOpsNode(
  inputTransform: TransformList,
  operations: JsonCompatible
) : Promise<AffineOpsNodeResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.TransformList },
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.TransformList, data: inputTransform },
    { type: InterfaceTypes.JsonCompatible, data: operations as JsonCompatible  },
  ]

  const args = []
  // Inputs
  const inputTransformName = '0'
  args.push(inputTransformName)

  const operationsName = '1'
  args.push(operationsName)

  // Outputs
  const outputTransformName = '0'
  args.push(outputTransformName)

  // Options
  args.push('--memory-io')

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'affine-ops')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    outputTransform: outputs[0]?.data as TransformList,
  }
  return result
}

export default affineOpsNode
