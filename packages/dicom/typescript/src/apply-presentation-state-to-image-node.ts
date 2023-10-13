// Generated file. To retain edits, remove this comment.

import {
  JsonCompatible,
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
 * @param {string} imageIn - Input DICOM file
 * @param {string} presentationStateFile - Process using presentation state file
 * @param {ApplyPresentationStateToImageOptions} options - options object
 *
 * @returns {Promise<ApplyPresentationStateToImageNodeResult>} - result object
 */
async function applyPresentationStateToImageNode(
  imageIn: string,
  presentationStateFile: string,
  options: ApplyPresentationStateToImageOptions = {}
) : Promise<ApplyPresentationStateToImageNodeResult> {

  const mountDirs: Set<string> = new Set()

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
    { type: InterfaceTypes.Image },
  ]

  mountDirs.add(path.dirname(imageIn as string))
  mountDirs.add(path.dirname(presentationStateFile as string))
  const inputs: Array<PipelineInput> = [
  ]

  const args = []
  // Inputs
  const imageInName = imageIn
  args.push(imageInName)
  mountDirs.add(path.dirname(imageInName))

  const presentationStateFileName = presentationStateFile
  args.push(presentationStateFileName)
  mountDirs.add(path.dirname(presentationStateFileName))

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

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), 'pipelines', 'apply-presentation-state-to-image')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs, mountDirs)
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    presentationStateOutStream: outputs[0]?.data as JsonCompatible,
    outputImage: outputs[1]?.data as Image,
  }
  return result
}

export default applyPresentationStateToImageNode
