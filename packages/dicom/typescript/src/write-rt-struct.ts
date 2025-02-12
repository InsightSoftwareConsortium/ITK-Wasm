// Generated file. To retain edits, remove this comment.

import {
  TextFile,
  BinaryFile,
  JsonCompatible,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import WriteRtStructOptions from './write-rt-struct-options.js'
import WriteRtStructResult from './write-rt-struct-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Write a DICOM RT Struct Structured Set for the given ROI contours and DICOM metadata
 *
 * @param {File | TextFile} inputCxt - Input Plastimatch CXT structure set file
 * @param {string} outputDicom - Output DICOM RT Struct Structure Set file
 * @param {WriteRtStructOptions} options - options object
 *
 * @returns {Promise<WriteRtStructResult>} - result object
 */
async function writeRtStruct(
  inputCxt: File | TextFile,
  outputDicom: string,
  options: WriteRtStructOptions = {}
) : Promise<WriteRtStructResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.BinaryFile, data: { path: outputDicom, data: new Uint8Array() }},
  ]

  let inputCxtFile = inputCxt
  if (inputCxt instanceof File) {
    const inputCxtBuffer = await inputCxt.arrayBuffer()
    inputCxtFile = { path: inputCxt.name, data: new TextDecoder().decode(inputCxtBuffer) }
  }
  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.TextFile, data: inputCxtFile as TextFile },
  ]

  const args = []
  // Inputs
  const inputCxtName = (inputCxtFile as TextFile).path
  args.push(inputCxtName)

  // Outputs
  const outputDicomName = outputDicom
  args.push(outputDicomName)

  // Options
  args.push('--memory-io')
  if (options.dicomMetadata) {
    const inputCountString = inputs.length.toString()
    inputs.push({ type: InterfaceTypes.JsonCompatible, data: options.dicomMetadata as JsonCompatible })
    args.push('--dicom-metadata', inputCountString)

  }

  const pipelinePath = 'write-rt-struct'

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
    outputDicom: outputs[0]?.data as BinaryFile,
  }
  return result
}

export default writeRtStruct
