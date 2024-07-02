// Generated file. To retain edits, remove this comment.

import {
  Image,
  BinaryFile,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import WriteSegmentationOptions from './write-segmentation-options.js'
import WriteSegmentationResult from './write-segmentation-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Write DICOM segmentation object
 *
 * @param {Image} inputImage - input segmentation image to write
 * @param {string} inputRefDicomSeries - input reference dicom series over which the segmentation was created
 * @param {string} outputDicomFile - written dicom segfile
 * @param {WriteSegmentationOptions} options - options object
 *
 * @returns {Promise<WriteSegmentationResult>} - result object
 */
async function writeSegmentation(
  inputImage: Image,
  inputRefDicomSeries: string,
  outputDicomFile: string,
  options: WriteSegmentationOptions = {}
) : Promise<WriteSegmentationResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.BinaryFile, data: { path: outputDicomFile, data: new Uint8Array() }},
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.Image, data: inputImage },
  ]

  const args = []
  // Inputs
  const inputImageName = '0'
  args.push(inputImageName)

  args.push(inputRefDicomSeries.toString())

  // Outputs
  const outputDicomFileName = outputDicomFile
  args.push(outputDicomFileName)

  // Options
  args.push('--memory-io')

  const pipelinePath = 'write-segmentation'

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
    outputDicomFile: outputs[0]?.data as BinaryFile,
  }
  return result
}

export default writeSegmentation
