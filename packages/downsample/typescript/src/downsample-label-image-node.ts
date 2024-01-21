// Generated file. To retain edits, remove this comment.

import {
  Image,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import DownsampleLabelImageNodeOptions from './downsample-label-image-node-options.js'
import DownsampleLabelImageNodeResult from './downsample-label-image-node-result.js'

import path from 'path'

/**
 * Apply a smoothing anti-alias filter and subsample the input image.
 *
 * @param {Image} input - Input image
 * @param {DownsampleLabelImageNodeOptions} options - options object
 *
 * @returns {Promise<DownsampleLabelImageNodeResult>} - result object
 */
async function downsampleLabelImageNode(
  input: Image,
  options: DownsampleLabelImageNodeOptions = { shrinkFactors: [] as number[], }
) : Promise<DownsampleLabelImageNodeResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.Image },
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.Image, data: input },
  ]

  const args = []
  // Inputs
  const inputName = '0'
  args.push(inputName)

  // Outputs
  const downsampledName = '0'
  args.push(downsampledName)

  // Options
  args.push('--memory-io')
  if (typeof options.shrinkFactors !== "undefined") {
    if(options.shrinkFactors.length < 2) {
      throw new Error('"shrink-factors" option must have a length > 2')
    }
    args.push('--shrink-factors')

    options.shrinkFactors.forEach((value) => {
      args.push(value.toString())

    })
  }
  if (typeof options.cropRadius !== "undefined") {
    if(options.cropRadius.length < 2) {
      throw new Error('"crop-radius" option must have a length > 2')
    }
    args.push('--crop-radius')

    options.cropRadius.forEach((value) => {
      args.push(value.toString())

    })
  }

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), 'pipelines', 'downsample-label-image')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    downsampled: outputs[0]?.data as Image,
  }
  return result
}

export default downsampleLabelImageNode
