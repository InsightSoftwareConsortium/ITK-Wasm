// Generated file. To retain edits, remove this comment.

import {
  PointSet,
  JsonCompatible,
  BinaryFile,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import WasmWritePointSetOptions from './wasm-write-point-set-options.js'
import WasmWritePointSetResult from './wasm-write-point-set-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Write an ITK-Wasm file format converted to a point set file format
 *
 * @param {PointSet} pointSet - Input point set
 * @param {string} serializedPointSet - Output point set
 * @param {WasmWritePointSetOptions} options - options object
 *
 * @returns {Promise<WasmWritePointSetResult>} - result object
 */
async function wasmWritePointSet(
  pointSet: PointSet,
  serializedPointSet: string,
  options: WasmWritePointSetOptions = {}
) : Promise<WasmWritePointSetResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
    { type: InterfaceTypes.BinaryFile, data: { path: serializedPointSet, data: new Uint8Array() }},
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.PointSet, data: pointSet },
  ]

  const args = []
  // Inputs
  const pointSetName = '0'
  args.push(pointSetName)

  // Outputs
  const couldWriteName = '0'
  args.push(couldWriteName)

  const serializedPointSetName = serializedPointSet
  args.push(serializedPointSetName)

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

  const pipelinePath = 'wasm-write-point-set'

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
    serializedPointSet: outputs[1]?.data as BinaryFile,
  }
  return result
}

export default wasmWritePointSet
