// Generated file. To retain edits, remove this comment.

import {
  Image,
  TransformList,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import ResampleToReferenceNodeOptions from './resample-to-reference-node-options.js'
import ResampleToReferenceNodeResult from './resample-to-reference-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Resample an image onto a reference image's grid with an optional transform and a selectable interpolator.
 *
 * @param {Image} input - The moving image to resample.
 * @param {Image} referenceImage - Reference image whose geometry defines the output grid. Only the geometry (origin, spacing, direction, size) is used; the pixel values are ignored.
 * @param {ResampleToReferenceNodeOptions} options - options object
 *
 * @returns {Promise<ResampleToReferenceNodeResult>} - result object
 */
async function resampleToReferenceNode(
  input: Image,
  referenceImage: Image,
  options: ResampleToReferenceNodeOptions = {}
) : Promise<ResampleToReferenceNodeResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.Image },
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.Image, data: input },
    { type: InterfaceTypes.Image, data: referenceImage },
  ]

  const args = []
  // Inputs
  const inputName = '0'
  args.push(inputName)

  const referenceImageName = '1'
  args.push(referenceImageName)

  // Outputs
  const outputName = '0'
  args.push(outputName)

  // Options
  args.push('--memory-io')
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

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'resample-to-reference')

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

export default resampleToReferenceNode
