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

import FreeSurferBinaryReadMeshOptions from './free-surfer-binary-read-mesh-options.js'
import FreeSurferBinaryReadMeshResult from './free-surfer-binary-read-mesh-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Read a mesh file format and convert it to the itk-wasm file format
 *
 * @param {File | BinaryFile} serializedMesh - Input mesh serialized in the file format
 * @param {FreeSurferBinaryReadMeshOptions} options - options object
 *
 * @returns {Promise<FreeSurferBinaryReadMeshResult>} - result object
 */
async function freeSurferBinaryReadMesh(
  serializedMesh: File | BinaryFile,
  options: FreeSurferBinaryReadMeshOptions = {}
) : Promise<FreeSurferBinaryReadMeshResult> {

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
  if (options.informationOnly) {
    options.informationOnly && args.push('--information-only')
  }

  const pipelinePath = 'free-surfer-binary-read-mesh'

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
    couldRead: outputs[0]?.data as JsonCompatible,
    mesh: outputs[1]?.data as Mesh,
  }
  return result
}

export default freeSurferBinaryReadMesh
