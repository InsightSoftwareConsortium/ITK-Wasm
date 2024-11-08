// Generated file. To retain edits, remove this comment.

import {
  TransformList,
  JsonCompatible,
  BinaryFile,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import WasmZstdWriteTransformOptions from './wasm-zstd-write-transform-options.js'
import WasmZstdWriteTransformResult from './wasm-zstd-write-transform-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Write an ITK-Wasm transform file format converted to a transform file format
 *
 * @param {TransformList} transform - Input transform
 * @param {string} serializedTransform - Output transform serialized in the file format.
 * @param {WasmZstdWriteTransformOptions} options - options object
 *
 * @returns {Promise<WasmZstdWriteTransformResult>} - result object
 */
async function wasmZstdWriteTransform(
  transform: TransformList,
  serializedTransform: string,
  options: WasmZstdWriteTransformOptions = {}
) : Promise<WasmZstdWriteTransformResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
    { type: InterfaceTypes.BinaryFile, data: { path: serializedTransform, data: new Uint8Array() }},
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.TransformList, data: transform },
  ]

  const args = []
  // Inputs
  const transformName = '0'
  args.push(transformName)

  // Outputs
  const couldWriteName = '0'
  args.push(couldWriteName)

  const serializedTransformName = serializedTransform
  args.push(serializedTransformName)

  // Options
  args.push('--memory-io')
  if (options.floatParameters) {
    options.floatParameters && args.push('--float-parameters')
  }
  if (options.useCompression) {
    options.useCompression && args.push('--use-compression')
  }

  const pipelinePath = 'wasm-zstd-write-transform'

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
    serializedTransform: outputs[1]?.data as BinaryFile,
  }
  return result
}

export default wasmZstdWriteTransform
