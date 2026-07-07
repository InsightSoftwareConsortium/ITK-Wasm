// Generated file. To retain edits, remove this comment.

import {
  TransformList,
  Image,
  JsonCompatible,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import ResampleBoundingBoxNodeOptions from './resample-bounding-box-node-options.js'
import ResampleBoundingBoxNodeResult from './resample-bounding-box-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Compute the padded moving-image region needed to resample the fixed image grid through a transform
 *
 * @param {TransformList} transform - Spatial transform mapping fixed image points into moving image space
 * @param {Image} fixed - Fixed image whose grid is resampled (metadata only)
 * @param {Image} moving - Moving image to be sampled (metadata only)
 * @param {ResampleBoundingBoxNodeOptions} options - options object
 *
 * @returns {Promise<ResampleBoundingBoxNodeResult>} - result object
 */
async function resampleBoundingBoxNode(
  transform: TransformList,
  fixed: Image,
  moving: Image,
  options: ResampleBoundingBoxNodeOptions = {}
) : Promise<ResampleBoundingBoxNodeResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.TransformList, data: transform },
    { type: InterfaceTypes.Image, data: fixed },
    { type: InterfaceTypes.Image, data: moving },
  ]

  const args = []
  // Inputs
  const transformName = '0'
  args.push(transformName)

  const fixedName = '1'
  args.push(fixedName)

  const movingName = '2'
  args.push(movingName)

  // Outputs
  const boundingBoxName = '0'
  args.push(boundingBoxName)

  // Options
  args.push('--memory-io')
  if (typeof options.padding !== "undefined") {
    args.push('--padding', options.padding.toString())

  }

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'resample-bounding-box')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    boundingBox: outputs[0]?.data as JsonCompatible,
  }
  return result
}

export default resampleBoundingBoxNode
