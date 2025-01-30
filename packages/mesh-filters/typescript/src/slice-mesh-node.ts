// Generated file. To retain edits, remove this comment.

import {
  Mesh,
  JsonCompatible,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import SliceMeshNodeResult from './slice-mesh-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Slice a mesh along planes into polylines.
 *
 * @param {Mesh} inputMesh - The input triangle mesh.
 * @param {JsonCompatible} planes - An array of plane locations to slice the mesh. Each plane is defined by an array of 'origin' and 'spacing' values.
 *
 * @returns {Promise<SliceMeshNodeResult>} - result object
 */
async function sliceMeshNode(
  inputMesh: Mesh,
  planes: JsonCompatible
) : Promise<SliceMeshNodeResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.Mesh },
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.Mesh, data: inputMesh },
    { type: InterfaceTypes.JsonCompatible, data: planes as JsonCompatible  },
  ]

  const args = []
  // Inputs
  const inputMeshName = '0'
  args.push(inputMeshName)

  const planesName = '1'
  args.push(planesName)

  // Outputs
  const polylinesName = '0'
  args.push(polylinesName)

  // Options
  args.push('--memory-io')

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'slice-mesh')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    polylines: outputs[0]?.data as Mesh,
  }
  return result
}

export default sliceMeshNode
