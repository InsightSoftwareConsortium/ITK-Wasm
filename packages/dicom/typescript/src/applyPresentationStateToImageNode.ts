import {
  JsonObject,
  Image,
  InterfaceTypes,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import ApplyPresentationStateToImageOptions from './ApplyPresentationStateToImageOptions.js'
import ApplyPresentationStateToImageNodeResult from './ApplyPresentationStateToImageNodeResult.js'


import path from 'path'

/**
 * Apply a presentation state to a given DICOM image and render output as pgm bitmap or dicom file.
 *
 * @param {Uint8Array} imageIn - Input DICOM file
 *
 * @returns {Promise<ApplyPresentationStateToImageNodeResult>} - result object
 */
async function applyPresentationStateToImageNode(  imageIn: Uint8Array,
  options: ApplyPresentationStateToImageOptions = {})
    : Promise<ApplyPresentationStateToImageNodeResult> {

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

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), 'pipelines', 'apply-presentation-state-to-image')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0) {
    throw new Error(stderr)
  }

  const result = {
    presentationStateOutStream: (outputs[0].data as JsonObject).data,
    outputImage: outputs[1].data as Image,
  }
  return result
}

export default applyPresentationStateToImageNode
