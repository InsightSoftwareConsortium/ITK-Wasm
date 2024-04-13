// Generated file. To retain edits, remove this comment.

import {
  Mesh,
  JsonCompatible,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import CompareMeshesNodeOptions from './compare-meshes-node-options.js'
import CompareMeshesNodeResult from './compare-meshes-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Compare meshes with a tolerance for regression testing.
 *
 * @param {Mesh} testMesh - The input test mesh
 * @param {CompareMeshesNodeOptions} options - options object
 *
 * @returns {Promise<CompareMeshesNodeResult>} - result object
 */
async function compareMeshesNode(
  testMesh: Mesh,
  options: CompareMeshesNodeOptions = { baselineMeshes: [] as Mesh[], }
) : Promise<CompareMeshesNodeResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
    { type: InterfaceTypes.Mesh },
    { type: InterfaceTypes.Mesh },
    { type: InterfaceTypes.Mesh },
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.Mesh, data: testMesh },
  ]

  const args = []
  // Inputs
  const testMeshName = '0'
  args.push(testMeshName)

  // Outputs
  const metricsName = '0'
  args.push(metricsName)

  const pointsDifferenceMeshName = '1'
  args.push(pointsDifferenceMeshName)

  const pointDataDifferenceMeshName = '2'
  args.push(pointDataDifferenceMeshName)

  const cellDataDifferenceMeshName = '3'
  args.push(cellDataDifferenceMeshName)

  // Options
  args.push('--memory-io')
  if (options.baselineMeshes) {
    if(options.baselineMeshes.length < 1) {
      throw new Error('"baseline-meshes" option must have a length > 1')
    }
    args.push('--baseline-meshes')

    options.baselineMeshes.forEach((value) => {
      const inputCountString = inputs.length.toString()
      inputs.push({ type: InterfaceTypes.Mesh, data: value as Mesh })
      args.push(inputCountString)

    })
  }
  if (options.pointsDifferenceThreshold) {
    args.push('--points-difference-threshold', options.pointsDifferenceThreshold.toString())

  }
  if (options.numberOfDifferentPointsTolerance) {
    args.push('--number-of-different-points-tolerance', options.numberOfDifferentPointsTolerance.toString())

  }
  if (options.pointDataDifferenceThreshold) {
    args.push('--point-data-difference-threshold', options.pointDataDifferenceThreshold.toString())

  }
  if (options.numberOfPointDataTolerance) {
    args.push('--number-of-point-data-tolerance', options.numberOfPointDataTolerance.toString())

  }
  if (options.cellDataDifferenceThreshold) {
    args.push('--cell-data-difference-threshold', options.cellDataDifferenceThreshold.toString())

  }
  if (options.numberOfCellDataTolerance) {
    args.push('--number-of-cell-data-tolerance', options.numberOfCellDataTolerance.toString())

  }

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'compare-meshes')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    metrics: outputs[0]?.data as JsonCompatible,
    pointsDifferenceMesh: outputs[1]?.data as Mesh,
    pointDataDifferenceMesh: outputs[2]?.data as Mesh,
    cellDataDifferenceMesh: outputs[3]?.data as Mesh,
  }
  return result
}

export default compareMeshesNode
