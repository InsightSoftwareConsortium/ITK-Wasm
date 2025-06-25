// Generated file. To retain edits, remove this comment.

import {
  TransformList,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import CreateQuaternionRigidTransformNodeOptions from './create-quaternion-rigid-transform-node-options.js'
import CreateQuaternionRigidTransformNodeResult from './create-quaternion-rigid-transform-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Create a quaternion-rigid spatial transformation.
 *
 * @param {CreateQuaternionRigidTransformNodeOptions} options - options object
 *
 * @returns {Promise<CreateQuaternionRigidTransformNodeResult>} - result object
 */
async function createQuaternionRigidTransformNode(
  options: CreateQuaternionRigidTransformNodeOptions = {}
) : Promise<CreateQuaternionRigidTransformNodeResult> {

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

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'create-quaternion-rigid-transform')

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

export default createQuaternionRigidTransformNode
