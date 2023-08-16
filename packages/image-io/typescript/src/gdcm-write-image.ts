// Generated file. To retain edits, remove this comment.

import {
  Image,
  JsonObject,
  BinaryFile,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import GdcmWriteImageOptions from './gdcm-write-image-options.js'
import GdcmWriteImageResult from './gdcm-write-image-result.js'


import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

/**
 * Write an itk-wasm file format converted to an image file format
 *
 * @param {Image} image - Input image
 * @param {GdcmWriteImageOptions} options - options object
 *
 * @returns {Promise<GdcmWriteImageResult>} - result object
 */
async function gdcmWriteImage(
  webWorker: null | Worker,
  image: Image,
  options: GdcmWriteImageOptions = {}
) : Promise<GdcmWriteImageResult> {

  const serializedImagePath = typeof options.serializedImagePath === 'undefined' ? 'serializedImage' : options.serializedImagePath
  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonObject },
    { type: InterfaceTypes.BinaryFile, data: { path: serializedImagePath, data: new Uint8Array() }},
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.Image, data: image },
  ]

  const args = []
  // Inputs
  const imageName = '0'
  args.push(imageName as string)

  // Outputs
  const couldWriteName = '0'
  args.push(couldWriteName)

  const serializedImageName = serializedImagePath
  args.push(serializedImageName)

  // Options
  args.push('--memory-io')
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push('--information-only')
  }
  if (typeof options.useCompression !== "undefined") {
    options.useCompression && args.push('--use-compression')
  }

  const pipelinePath = 'gdcm-write-image'

  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl() })
  if (returnValue !== 0) {
    throw new Error(stderr)
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    couldWrite: (outputs[0].data as JsonObject).data as boolean,
    serializedImage: outputs[1].data as BinaryFile,
  }
  return result
}

export default gdcmWriteImage
