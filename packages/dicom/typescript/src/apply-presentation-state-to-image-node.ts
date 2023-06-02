// Generated file. Do not edit.

import {
  BinaryFile,
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
 * Apply a presentation state to a given DICOM image and render output as bitmap, or dicom file.
 *
 * @param {BinaryFile} imageIn - Input DICOM file
 * @param {BinaryFile} presentationStateFile - Process using presentation state file
 *
 * @returns {Promise<ApplyPresentationStateToImageNodeResult>} - result object
 */
async function applyPresentationStateToImageNode(
  imageIn: BinaryFile,
  presentationStateFile: BinaryFile,
  options: ApplyPresentationStateToImageOptions = {}
) : Promise<ApplyPresentationStateToImageNodeResult> {

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
  if (typeof options.colorOutput !== "undefined") {
    args.push('--color-output')
  }
  if (typeof options.configFile !== "undefined") {
    args.push('--config-file', options.configFile.toString())
  }
  if (typeof options.frame !== "undefined") {
    args.push('--frame', options.frame.toString())
  }
  if (typeof options.noPresentationStateOutput !== "undefined") {
    args.push('--no-presentation-state-output')
  }
  if (typeof options.noBitmapOutput !== "undefined") {
    args.push('--no-bitmap-output')
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
