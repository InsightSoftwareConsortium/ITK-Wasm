// Generated file. To retain edits, remove this comment.

import {
  Mesh,
  JsonCompatible,
  BinaryFile,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import StlWriteMeshOptions from './stl-write-mesh-options.js'
import StlWriteMeshResult from './stl-write-mesh-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Write an itk-wasm file format converted to an mesh file format
 *
 * @param {Mesh} mesh - Input mesh
 * @param {string} serializedMesh - Output mesh
 * @param {StlWriteMeshOptions} options - options object
 *
 * @returns {Promise<StlWriteMeshResult>} - result object
 */
async function stlWriteMesh(
  mesh: Mesh,
  serializedMesh: string,
  options: StlWriteMeshOptions = {}
) : Promise<StlWriteMeshResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
    { type: InterfaceTypes.BinaryFile, data: { path: serializedMesh, data: new Uint8Array() }},
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.Mesh, data: mesh },
  ]

  const args = []
  // Inputs
  const meshName = '0'
  args.push(meshName)

  // Outputs
  const couldWriteName = '0'
  args.push(couldWriteName)

  const serializedMeshName = serializedMesh
  args.push(serializedMeshName)

  // Options
  args.push('--memory-io')
  if (options.informationOnly) {
    options.informationOnly && args.push('--information-only')
  }
  if (options.useCompression) {
    options.useCompression && args.push('--use-compression')
  }
  if (options.binaryFileType) {
    options.binaryFileType && args.push('--binary-file-type')
  }

  const pipelinePath = 'stl-write-mesh'

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
    couldWrite: outputs[0]?.data as JsonCompatible,
    serializedMesh: outputs[1]?.data as BinaryFile,
  }
  return result
}

export default stlWriteMesh
