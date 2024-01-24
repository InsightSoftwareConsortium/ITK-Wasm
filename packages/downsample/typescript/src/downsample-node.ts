// Generated file. To retain edits, remove this comment.

import {
  Image,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import DownsampleNodeOptions from './downsample-node-options.js'
import DownsampleNodeResult from './downsample-node-result.js'

import path from 'path'

/**
 * Apply a smoothing anti-alias filter and subsample the input image.
 *
 * @param {Image} input - Input image
 * @param {DownsampleNodeOptions} options - options object
 *
 * @returns {Promise<DownsampleNodeResult>} - result object
 */
async function downsampleNode(
  input: Image,
  options: DownsampleNodeOptions = { shrinkFactors: [2,2], }
) : Promise<DownsampleNodeResult> {

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
  if (options.shrinkFactors) {
    if(options.shrinkFactors.length < 2) {
      throw new Error('"shrink-factors" option must have a length > 2')
    }
    args.push('--shrink-factors')

    options.shrinkFactors.forEach((value) => {
      args.push(value.toString())

    })
  }
  if (options.cropRadius) {
    if(options.cropRadius.length < 2) {
      throw new Error('"crop-radius" option must have a length > 2')
    }
    args.push('--crop-radius')

    options.cropRadius.forEach((value) => {
      args.push(value.toString())

    })
  }

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), 'pipelines', 'downsample')

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

export default downsampleNode
