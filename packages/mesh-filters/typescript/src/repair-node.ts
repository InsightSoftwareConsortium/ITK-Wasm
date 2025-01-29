// Generated file. To retain edits, remove this comment.

import {
  Mesh,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import RepairNodeOptions from './repair-node-options.js'
import RepairNodeResult from './repair-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Repair a mesh so it is 2-manifold and optionally watertight.
 *
 * @param {Mesh} inputMesh - The input mesh
 * @param {RepairNodeOptions} options - options object
 *
 * @returns {Promise<RepairNodeResult>} - result object
 */
async function repairNode(
  inputMesh: Mesh,
  options: RepairNodeOptions = {}
) : Promise<RepairNodeResult> {

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
  if (options.mergeTolerance) {
    args.push('--merge-tolerance', options.mergeTolerance.toString())

  }
  if (options.minimumComponentArea) {
    args.push('--minimum-component-area', options.minimumComponentArea.toString())

  }
  if (options.maximumHoleArea) {
    args.push('--maximum-hole-area', options.maximumHoleArea.toString())

  }
  if (options.maximumHoleEdges) {
    args.push('--maximum-hole-edges', options.maximumHoleEdges.toString())

  }
  if (options.maximumDegree3Distance) {
    args.push('--maximum-degree3-distance', options.maximumDegree3Distance.toString())

  }
  if (options.removeIntersectingTriangles) {
    options.removeIntersectingTriangles && args.push('--remove-intersecting-triangles')
  }

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'repair')

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

export default repairNode
