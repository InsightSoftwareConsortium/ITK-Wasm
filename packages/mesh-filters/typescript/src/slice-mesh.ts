// Generated file. To retain edits, remove this comment.

import {
  Mesh,
  JsonCompatible,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import SliceMeshOptions from './slice-mesh-options.js'
import SliceMeshResult from './slice-mesh-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Slice a mesh along planes into polylines.
 *
 * @param {Mesh} inputMesh - The input triangle mesh.
 * @param {JsonCompatible} planes - An array of plane locations to slice the mesh. Each plane is defined by an array of 'origin' and 'spacing' values.
 * @param {SliceMeshOptions} options - options object
 *
 * @returns {Promise<SliceMeshResult>} - result object
 */
async function sliceMesh(
  inputMesh: Mesh,
  planes: JsonCompatible,
  options: SliceMeshOptions = {}
) : Promise<SliceMeshResult> {

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

  const pipelinePath = 'slice-mesh'

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
    polylines: outputs[0]?.data as Mesh,
  }
  return result
}

export default sliceMesh
