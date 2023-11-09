// Generated file. To retain edits, remove this comment.

import {
  BinaryFile,
  JsonCompatible,
  Image,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import ApplyPresentationStateToImageOptions from './apply-presentation-state-to-image-options.js'
import ApplyPresentationStateToImageResult from './apply-presentation-state-to-image-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

/**
 * Apply a presentation state to a given DICOM image and render output as bitmap, or dicom file.
 *
 * @param {File | BinaryFile} imageIn - Input DICOM file
 * @param {File | BinaryFile} presentationStateFile - Process using presentation state file
 * @param {ApplyPresentationStateToImageOptions} options - options object
 *
 * @returns {Promise<ApplyPresentationStateToImageResult>} - result object
 */
async function applyPresentationStateToImage(
  webWorker: null | Worker | boolean,
  imageIn: File | BinaryFile,
  presentationStateFile: File | BinaryFile,
  options: ApplyPresentationStateToImageOptions = {}
) : Promise<ApplyPresentationStateToImageResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
    { type: InterfaceTypes.Image },
  ]

  let imageInFile = imageIn
  if (imageIn instanceof File) {
    const imageInBuffer = await imageIn.arrayBuffer()
    imageInFile = { path: imageIn.name, data: new Uint8Array(imageInBuffer) }
  }
  let presentationStateFileFile = presentationStateFile
  if (presentationStateFile instanceof File) {
    const presentationStateFileBuffer = await presentationStateFile.arrayBuffer()
    presentationStateFileFile = { path: presentationStateFile.name, data: new Uint8Array(presentationStateFileBuffer) }
  }
  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.BinaryFile, data: imageInFile as BinaryFile },
    { type: InterfaceTypes.BinaryFile, data: presentationStateFileFile as BinaryFile },
  ]

  const args = []
  // Inputs
  const imageInName = (imageInFile as BinaryFile).path
  args.push(imageInName)

  const presentationStateFileName = (presentationStateFileFile as BinaryFile).path
  args.push(presentationStateFileName)

  // Outputs
  const presentationStateOutStreamName = '0'
  args.push(presentationStateOutStreamName)

  const outputImageName = '1'
  args.push(outputImageName)

  // Options
  args.push('--memory-io')
  if (typeof options.colorOutput !== "undefined") {
    options.colorOutput && args.push('--color-output')
  }
  if (typeof options.configFile !== "undefined") {
    args.push('--config-file', options.configFile.toString())

  }
  if (typeof options.frame !== "undefined") {
    args.push('--frame', options.frame.toString())

  }
  if (typeof options.noPresentationStateOutput !== "undefined") {
    options.noPresentationStateOutput && args.push('--no-presentation-state-output')
  }
  if (typeof options.noBitmapOutput !== "undefined") {
    options.noBitmapOutput && args.push('--no-bitmap-output')
  }

  const pipelinePath = 'apply-presentation-state-to-image'

  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl() })
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    presentationStateOutStream: outputs[0]?.data as JsonCompatible,
    outputImage: outputs[1]?.data as Image,
  }
  return result
}

export default applyPresentationStateToImage
