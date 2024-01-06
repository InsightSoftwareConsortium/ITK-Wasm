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

import WasmZstdWriteMeshOptions from './wasm-zstd-write-mesh-options.js'
import WasmZstdWriteMeshResult from './wasm-zstd-write-mesh-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Write an itk-wasm file format converted to an mesh file format
 *
 * @param {Mesh} mesh - Input mesh
 * @param {string} serializedMesh - Output mesh
 * @param {WasmZstdWriteMeshOptions} options - options object
 *
 * @returns {Promise<WasmZstdWriteMeshResult>} - result object
 */
async function wasmZstdWriteMesh(
  mesh: Mesh,
  serializedMesh: string,
  options: WasmZstdWriteMeshOptions = {}
) : Promise<WasmZstdWriteMeshResult> {

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
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push('--information-only')
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push('--use-compression')
  }
  if (typeof options.binaryFileType !== "undefined") {
    options.binaryFileType && args.push('--binary-file-type')
  }

  const pipelinePath = 'wasm-zstd-write-mesh'

  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl(), webWorker: options?.webWorker ?? await getDefaultWebWorker() })
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

export default wasmZstdWriteMesh
