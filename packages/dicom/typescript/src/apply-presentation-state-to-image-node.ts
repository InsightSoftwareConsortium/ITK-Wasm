// Generated file. To retain edits, remove this comment.

import {
  JsonCompatible,
  Image,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import ApplyPresentationStateToImageNodeOptions from './apply-presentation-state-to-image-node-options.js'
import ApplyPresentationStateToImageNodeResult from './apply-presentation-state-to-image-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Apply a presentation state to a given DICOM image and render output as bitmap, or dicom file.
 *
 * @param {string} imageIn - Input DICOM file
 * @param {string} presentationStateFile - Process using presentation state file
 * @param {ApplyPresentationStateToImageNodeOptions} options - options object
 *
 * @returns {Promise<ApplyPresentationStateToImageNodeResult>} - result object
 */
async function applyPresentationStateToImageNode(
  imageIn: string,
  presentationStateFile: string,
  options: ApplyPresentationStateToImageNodeOptions = {}
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
  if (options.colorOutput) {
    options.colorOutput && args.push('--color-output')
  }
  if (options.configFile) {
    args.push('--config-file', options.configFile.toString())

  }
  if (options.frame) {
    args.push('--frame', options.frame.toString())

  }
  if (options.noPresentationStateOutput) {
    options.noPresentationStateOutput && args.push('--no-presentation-state-output')
  }
  if (options.noBitmapOutput) {
    options.noBitmapOutput && args.push('--no-bitmap-output')
  }

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'apply-presentation-state-to-image')

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
