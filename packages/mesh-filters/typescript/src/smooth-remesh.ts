// Generated file. To retain edits, remove this comment.

import {
  Mesh,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import SmoothRemeshOptions from './smooth-remesh-options.js'
import SmoothRemeshResult from './smooth-remesh-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Smooth and remesh a mesh to improve quality.
 *
 * @param {Mesh} inputMesh - The input mesh
 * @param {SmoothRemeshOptions} options - options object
 *
 * @returns {Promise<SmoothRemeshResult>} - result object
 */
async function smoothRemesh(
  inputMesh: Mesh,
  options: SmoothRemeshOptions = {}
) : Promise<SmoothRemeshResult> {

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
  if (typeof options.numberPoints !== "undefined") {
    args.push('--number-points', options.numberPoints.toString())

  }
  if (typeof options.triangleShapeAdaptation !== "undefined") {
    args.push('--triangle-shape-adaptation', options.triangleShapeAdaptation.toString())

  }
  if (typeof options.triangleSizeAdaptation !== "undefined") {
    args.push('--triangle-size-adaptation', options.triangleSizeAdaptation.toString())

  }
  if (typeof options.normalIterations !== "undefined") {
    args.push('--normal-iterations', options.normalIterations.toString())

  }
  if (typeof options.lloydIterations !== "undefined") {
    args.push('--lloyd-iterations', options.lloydIterations.toString())

  }
  if (typeof options.newtonIterations !== "undefined") {
    args.push('--newton-iterations', options.newtonIterations.toString())

  }
  if (typeof options.newtonM !== "undefined") {
    args.push('--newton-m', options.newtonM.toString())

  }
  if (typeof options.lfsSamples !== "undefined") {
    args.push('--lfs-samples', options.lfsSamples.toString())

  }

  const pipelinePath = 'smooth-remesh'

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

export default smoothRemesh
