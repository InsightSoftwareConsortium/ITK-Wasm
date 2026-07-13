// Generated file. To retain edits, remove this comment.

import {
  Mesh,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import RepairOptions from './repair-options.js'
import RepairResult from './repair-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Repair a mesh so it is 2-manifold and optionally watertight.
 *
 * @param {Mesh} inputMesh - The input mesh
 * @param {RepairOptions} options - options object
 *
 * @returns {Promise<RepairResult>} - result object
 */
async function repair(
  inputMesh: Mesh,
  options: RepairOptions = {}
) : Promise<RepairResult> {

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
  if (typeof options.mergeTolerance !== "undefined") {
    args.push('--merge-tolerance', options.mergeTolerance.toString())

  }
  if (typeof options.minimumComponentArea !== "undefined") {
    args.push('--minimum-component-area', options.minimumComponentArea.toString())

  }
  if (typeof options.maximumHoleArea !== "undefined") {
    args.push('--maximum-hole-area', options.maximumHoleArea.toString())

  }
  if (typeof options.maximumHoleEdges !== "undefined") {
    args.push('--maximum-hole-edges', options.maximumHoleEdges.toString())

  }
  if (typeof options.maximumDegree3Distance !== "undefined") {
    args.push('--maximum-degree3-distance', options.maximumDegree3Distance.toString())

  }
  if (typeof options.removeIntersectingTriangles !== "undefined") {
    options.removeIntersectingTriangles && args.push('--remove-intersecting-triangles')
  }

  const pipelinePath = 'repair'

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
    outputMesh: outputs[0]?.data as Mesh,
  }
  return result
}

export default repair
