// Generated file. To retain edits, remove this comment.

import {
  TransformList,
  Image,
  JsonCompatible,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import ResampleBoundingBoxOptions from './resample-bounding-box-options.js'
import ResampleBoundingBoxResult from './resample-bounding-box-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Compute the padded moving-image region needed to resample the fixed image grid through a transform
 *
 * @param {TransformList} transform - Spatial transform mapping fixed image points into moving image space
 * @param {Image} fixed - Fixed image whose grid is resampled (metadata only)
 * @param {Image} moving - Moving image to be sampled (metadata only)
 * @param {ResampleBoundingBoxOptions} options - options object
 *
 * @returns {Promise<ResampleBoundingBoxResult>} - result object
 */
async function resampleBoundingBox(
  transform: TransformList,
  fixed: Image,
  moving: Image,
  options: ResampleBoundingBoxOptions = {}
) : Promise<ResampleBoundingBoxResult> {

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

  const pipelinePath = 'resample-bounding-box'

  let workerToUse = options?.webWorker
  if (workerToUse === undefined) {
    workerToUse = await getDefaultWebWorker()
  }
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl(), webWorker: workerToUse, noCopy: options?.noCopy })
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    boundingBox: outputs[0]?.data as JsonCompatible,
  }
  return result
}

export default resampleBoundingBox
