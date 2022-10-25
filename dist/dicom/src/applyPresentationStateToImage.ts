import {
  JsonObject,
  Image,
  InterfaceTypes,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import ApplyPresentationStateToImageOptions from './ApplyPresentationStateToImageOptions.js'
import ApplyPresentationStateToImageResult from './ApplyPresentationStateToImageResult.js'

/**
 * Apply a presentation state to a given DICOM image and render output as pgm bitmap or dicom file.
 *
 * @param {Uint8Array} imageIn - Input DICOM file
 *
 * @returns {Promise<ApplyPresentationStateToImageResult>} - result object
 */
async function applyPresentationStateToImage(
  webWorker: null | Worker,
  imageIn: Uint8Array,
  options: ApplyPresentationStateToImageOptions = {})
    : Promise<ApplyPresentationStateToImageResult> {

  const desiredOutputs = [
    { type: InterfaceTypes.JsonObject },
    { type: InterfaceTypes.Image },
  ]
  const inputs: [ PipelineInput ] = [
    { type: InterfaceTypes.BinaryFile, data: { data: imageIn, path: "file0" }  },
  ]

  const args = []
  // Inputs
  args.push('file0')
  // Outputs
  args.push('0')
  args.push('1')
  // Options
  args.push('--memory-io')
  if (options.presentationStateFile) {
    const inputFile = 'file' + inputs.length.toString()
    inputs.push({ type: InterfaceTypes.BinaryFile, data: { data: options.presentationStateFile, path: inputFile } })
    args.push('--presentation-state-file', inputFile)
  }
  if (options.configFile) {
    args.push('--config-file', options.configFile.toString())
  }
  if (options.frame) {
    args.push('--frame', options.frame.toString())
  }
  if (options.presentationStateOutput) {
    args.push('--presentation-state-output')
  }
  if (options.bitmapOutput) {
    args.push('--bitmap-output')
  }
  if (options.pgm) {
    args.push('--pgm')
  }
  if (options.dicom) {
    args.push('--dicom')
  }

  const pipelinePath = 'apply-presentation-state-to-image'

  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(webWorker, pipelinePath, args, desiredOutputs, inputs)
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
