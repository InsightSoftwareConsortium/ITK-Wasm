// Generated file. To retain edits, remove this comment.

import {
  Mesh,
  JsonCompatible,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import CompareMeshesOptions from './compare-meshes-options.js'
import CompareMeshesResult from './compare-meshes-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Compare meshes with a tolerance for regression testing.
 *
 * @param {Mesh} testMesh - The input test mesh
 * @param {CompareMeshesOptions} options - options object
 *
 * @returns {Promise<CompareMeshesResult>} - result object
 */
async function compareMeshes(
  testMesh: Mesh,
  options: CompareMeshesOptions = { baselineMeshes: [] as Mesh[], }
) : Promise<CompareMeshesResult> {

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

    await Promise.all(options.baselineMeshes.map(async (value) => {
      const inputCountString = inputs.length.toString()
      inputs.push({ type: InterfaceTypes.Mesh, data: value as Mesh })
      args.push(inputCountString)

    }))
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

  const pipelinePath = 'compare-meshes'

  let workerToUse = options?.webWorker
  if (workerToUse === undefined) {
    workerToUse = await getDefaultWebWorker()
  }
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl(), webWorker: workerToUse, noCopy: options?.noCopy })
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    metrics: outputs[0]?.data as JsonCompatible,
    pointsDifferenceMesh: outputs[1]?.data as Mesh,
    pointDataDifferenceMesh: outputs[2]?.data as Mesh,
    cellDataDifferenceMesh: outputs[3]?.data as Mesh,
  }
  return result
}

export default compareMeshes
