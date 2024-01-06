// Generated file. To retain edits, remove this comment.

import {
  BinaryFile,
  JsonCompatible,
  Mesh,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import StlReadMeshOptions from './stl-read-mesh-options.js'
import StlReadMeshResult from './stl-read-mesh-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Read a mesh file format and convert it to the itk-wasm file format
 *
 * @param {File | BinaryFile} serializedMesh - Input mesh serialized in the file format
 * @param {StlReadMeshOptions} options - options object
 *
 * @returns {Promise<StlReadMeshResult>} - result object
 */
async function stlReadMesh(
  serializedMesh: File | BinaryFile,
  options: StlReadMeshOptions = {}
) : Promise<StlReadMeshResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
    { type: InterfaceTypes.Mesh },
  ]

  let serializedMeshFile = serializedMesh
  if (serializedMesh instanceof File) {
    const serializedMeshBuffer = await serializedMesh.arrayBuffer()
    serializedMeshFile = { path: serializedMesh.name, data: new Uint8Array(serializedMeshBuffer) }
  }
  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.BinaryFile, data: serializedMeshFile as BinaryFile },
  ]

  const args = []
  // Inputs
  const serializedMeshName = (serializedMeshFile as BinaryFile).path
  args.push(serializedMeshName)

  // Outputs
  const couldReadName = '0'
  args.push(couldReadName)

  const meshName = '1'
  args.push(meshName)

  // Options
  args.push('--memory-io')
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push('--information-only')
  }

  const pipelinePath = 'stl-read-mesh'

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
    couldRead: outputs[0]?.data as JsonCompatible,
    mesh: outputs[1]?.data as Mesh,
  }
  return result
}

export default stlReadMesh
