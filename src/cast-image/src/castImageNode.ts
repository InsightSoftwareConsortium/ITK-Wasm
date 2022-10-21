import {
  Image,
  InterfaceTypes,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import CastImageOptions from './CastImageOptions.js'
import CastImageNodeResult from './CastImageNodeResult.js'


import path from 'path'

/**
 * Cast an image from one image type to another
 *
 * @param {Image} inputImage - The input image
 *
 * @returns {Promise<CastImageNodeResult>} - result object
 */
async function castImageNode(  inputImage: Image,
  options: CastImageOptions = {})
    : Promise<CastImageNodeResult> {

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

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), 'pipelines', 'cast-image')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0) {
    throw new Error(stderr)
  }

  const result = {
    outputImage: outputs[0].data as Image,
  }
  return result
}

export default castImageNode
