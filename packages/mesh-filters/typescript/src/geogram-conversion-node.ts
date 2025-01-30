// Generated file. To retain edits, remove this comment.

import {
  Mesh,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import GeogramConversionNodeResult from './geogram-conversion-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * A test for reading and writing with geogram, itk::QuadEdgeMesh meshes
 *
 * @param {Mesh} inputMesh - The input mesh
 *
 * @returns {Promise<GeogramConversionNodeResult>} - result object
 */
async function geogramConversionNode(
  inputMesh: Mesh
) : Promise<GeogramConversionNodeResult> {

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

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'geogram-conversion')

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

export default geogramConversionNode
