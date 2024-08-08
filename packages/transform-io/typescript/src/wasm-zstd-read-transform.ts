// Generated file. To retain edits, remove this comment.

import {
  BinaryFile,
  JsonCompatible,
  Transform,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import WasmZstdReadTransformOptions from './wasm-zstd-read-transform-options.js'
import WasmZstdReadTransformResult from './wasm-zstd-read-transform-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Read an transform file format and convert it to the ITK-Wasm transform file format
 *
 * @param {File | BinaryFile} serializedTransform - Input transform serialized in the file format
 * @param {WasmZstdReadTransformOptions} options - options object
 *
 * @returns {Promise<WasmZstdReadTransformResult>} - result object
 */
async function wasmZstdReadTransform(
  serializedTransform: File | BinaryFile,
  options: WasmZstdReadTransformOptions = {}
) : Promise<WasmZstdReadTransformResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
    { type: InterfaceTypes.Transform },
  ]

  let serializedTransformFile = serializedTransform
  if (serializedTransform instanceof File) {
    const serializedTransformBuffer = await serializedTransform.arrayBuffer()
    serializedTransformFile = { path: serializedTransform.name, data: new Uint8Array(serializedTransformBuffer) }
  }
  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.BinaryFile, data: serializedTransformFile as BinaryFile },
  ]

  const args = []
  // Inputs
  const serializedTransformName = (serializedTransformFile as BinaryFile).path
  args.push(serializedTransformName)

  // Outputs
  const couldReadName = '0'
  args.push(couldReadName)

  const transformName = '1'
  args.push(transformName)

  // Options
  args.push('--memory-io')
  if (options.floatParameters) {
    options.floatParameters && args.push('--float-parameters')
  }

  const pipelinePath = 'wasm-zstd-read-transform'

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
    transform: outputs[1]?.data as Transform,
  }
  return result
}

export default wasmZstdReadTransform
