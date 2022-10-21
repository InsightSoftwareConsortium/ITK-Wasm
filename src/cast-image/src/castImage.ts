import {
  Image,
  InterfaceTypes,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import CastImageOptions from './CastImageOptions.js'
import CastImageResult from './CastImageResult.js'

/**
 * Cast an image from one image type to another
 *
 * @param {Image} inputImage - The input image
 *
 * @returns {Promise<CastImageResult>} - result object
 */
async function castImage(
  webWorker: null | Worker,
  inputImage: Image,
  options: CastImageOptions = {})
    : Promise<CastImageResult> {

  const desiredOutputs = [
    { type: InterfaceTypes.Image },
  ]
  const inputs: [ PipelineInput ] = [
    { type: InterfaceTypes.Image, data: inputImage },
  ]

  const args = []
  // Inputs
  args.push('0')
  // Outputs
  args.push('0')
  // Options
  args.push('--memory-io')
  if (options.componentType) {
    args.push('--component-type', options.componentType.toString())
  }
  if (options.pixelType) {
    args.push('--pixel-type', options.pixelType.toString())
  }

  const pipelinePath = 'cast-image'

  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(webWorker, pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0) {
    throw new Error(stderr)
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    outputImage: outputs[0].data as Image,
  }
  return result
}

export default castImage
