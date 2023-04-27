// Generated file. Do not edit.

import {
  BinaryFile,
  JsonObject,
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
 * Apply a presentation state to a given DICOM image and render output as pgm bitmap or dicom file.
 *
 * @param {BinaryFile} imageIn - Input DICOM file
 * @param {BinaryFile} presentationStateFile - Process using presentation state file
 *
 * @returns {Promise<ApplyPresentationStateToImageResult>} - result object
 */
async function applyPresentationStateToImage(
  webWorker: null | Worker,
  imageIn: BinaryFile,
  presentationStateFile: BinaryFile,
  options: ApplyPresentationStateToImageOptions = {}
) : Promise<ApplyPresentationStateToImageResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonObject },
    { type: InterfaceTypes.Image },
  ]
  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.BinaryFile, data: imageIn },
    { type: InterfaceTypes.BinaryFile, data: presentationStateFile },
  ]

  const args = []
  // Inputs
  args.push(imageIn.path)
  args.push(presentationStateFile.path)
  // Outputs
  args.push('0')
  args.push('1')
  // Options
  args.push('--memory-io')
  if (typeof options.configFile !== "undefined") {
    args.push('--config-file', options.configFile.toString())
  }
  if (typeof options.frame !== "undefined") {
    args.push('--frame', options.frame.toString())
  }
  if (typeof options.presentationStateOutput !== "undefined") {
    args.push('--presentation-state-output')
  }
  if (typeof options.bitmapOutput !== "undefined") {
    args.push('--bitmap-output')
  }
  if (typeof options.pgm !== "undefined") {
    args.push('--pgm')
  }
  if (typeof options.dicom !== "undefined") {
    args.push('--dicom')
  }

  const pipelinePath = 'apply-presentation-state-to-image'

  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl() })
  if (returnValue !== 0) {
    throw new Error(stderr)
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    presentationStateOutStream: (outputs[0].data as JsonObject).data,
    outputImage: outputs[1].data as Image,
  }
  return result
}

export default applyPresentationStateToImage
