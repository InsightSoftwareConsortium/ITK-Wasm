// Generated file. To retain edits, remove this comment.

import {
  Image,
  TransformList,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import ResampleNodeOptions from './resample-node-options.js'
import ResampleNodeResult from './resample-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Resample an image onto an explicitly parameterized output grid with an optional transform and a selectable interpolator.
 *
 * @param {Image} input - The moving image to resample.
 * @param {ResampleNodeOptions} options - options object
 *
 * @returns {Promise<ResampleNodeResult>} - result object
 */
async function resampleNode(
  input: Image,
  options: ResampleNodeOptions = {}
) : Promise<ResampleNodeResult> {

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
  const outputName = '0'
  args.push(outputName)

  // Options
  args.push('--memory-io')
  if (typeof options.size !== "undefined") {
    if(options.size.length < 1) {
      throw new Error('"size" option must have a length > 1')
    }
    args.push('--size')

    options.size.forEach((value) => {
      args.push(value.toString())
    })
  }
  if (typeof options.outputSpacing !== "undefined") {
    if(options.outputSpacing.length < 1) {
      throw new Error('"output-spacing" option must have a length > 1')
    }
    args.push('--output-spacing')

    options.outputSpacing.forEach((value) => {
      args.push(value.toString())
    })
  }
  if (typeof options.outputOrigin !== "undefined") {
    if(options.outputOrigin.length < 1) {
      throw new Error('"output-origin" option must have a length > 1')
    }
    args.push('--output-origin')

    options.outputOrigin.forEach((value) => {
      args.push(value.toString())
    })
  }
  if (typeof options.outputDirection !== "undefined") {
    if(options.outputDirection.length < 1) {
      throw new Error('"output-direction" option must have a length > 1')
    }
    args.push('--output-direction')

    options.outputDirection.forEach((value) => {
      args.push(value.toString())
    })
  }
  if (typeof options.transform !== "undefined") {
    const inputCountString = inputs.length.toString()
    inputs.push({ type: InterfaceTypes.TransformList, data: options.transform as TransformList })
    args.push('--transform', inputCountString)

  }
  if (typeof options.interpolator !== "undefined") {
    if (!['linear', 'nearest_neighbor', 'label_image', 'b_spline', 'windowed_sinc', 'gaussian'].includes(options.interpolator)) {
      throw new Error('"interpolator" option must be one of linear, nearest_neighbor, label_image, b_spline, windowed_sinc, gaussian')
    }
    args.push('--interpolator', options.interpolator.toString())

  }
  if (typeof options.defaultValue !== "undefined") {
    args.push('--default-value', options.defaultValue.toString())

  }

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'resample')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    output: outputs[0]?.data as Image,
  }
  return result
}

export default resampleNode
