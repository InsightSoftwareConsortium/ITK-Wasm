import {
  JsonObject,
  Image,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import ApplyPresentationStateToImageOptions from './apply-presentation-state-to-image-options.js'
import ApplyPresentationStateToImageNodeResult from './apply-presentation-state-to-image-node-result.js'


import path from 'path'

/**
 * Apply a presentation state to a given DICOM image and render output as pgm bitmap or dicom file.
 *
 * @param {Uint8Array} imageIn - Input DICOM file
 *
 * @returns {Promise<ApplyPresentationStateToImageNodeResult>} - result object
 */
async function applyPresentationStateToImageNode(
  imageIn: Uint8Array,
  options: ApplyPresentationStateToImageOptions = {}
) : Promise<ApplyPresentationStateToImageNodeResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonObject },
    { type: InterfaceTypes.Image },
  ]
  const inputs: Array<PipelineInput> = [
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
  if (typeof options.presentationStateFile !== "undefined") {
    const inputFile = 'file' + inputs.length.toString()
    inputs.push({ type: InterfaceTypes.BinaryFile, data: { data: options.presentationStateFile, path: inputFile } })
    args.push('--presentation-state-file', inputFile)
  }
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

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), '..', 'pipelines', 'apply-presentation-state-to-image')

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
