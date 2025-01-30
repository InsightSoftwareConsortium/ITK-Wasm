// Generated file. To retain edits, remove this comment.

import {
  Mesh,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import KeepLargestComponentNodeResult from './keep-largest-component-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Keep only the largest component in the mesh.
 *
 * @param {Mesh} inputMesh - The input mesh.
 *
 * @returns {Promise<KeepLargestComponentNodeResult>} - result object
 */
async function keepLargestComponentNode(
  inputMesh: Mesh
) : Promise<KeepLargestComponentNodeResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.Mesh },
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.Mesh, data: inputMesh },
  ]

  const args = []
  // Inputs
  const inputMeshName = '0'
  args.push(inputMeshName)

  // Outputs
  const outputMeshName = '0'
  args.push(outputMeshName)

  // Options
  args.push('--memory-io')

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'keep-largest-component')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    outputMesh: outputs[0]?.data as Mesh,
  }
  return result
}

export default keepLargestComponentNode
