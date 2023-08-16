// Generated file. To retain edits, remove this comment.

import {
  JsonObject,
  Image,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import Ge5ReadImageOptions from './ge5-read-image-options.js'
import Ge5ReadImageNodeResult from './ge5-read-image-node-result.js'


import path from 'path'

/**
 * Read an image file format and convert it to the itk-wasm file format
 *
 * @param {string} serializedImage - Input image serialized in the file format
 * @param {Ge5ReadImageOptions} options - options object
 *
 * @returns {Promise<Ge5ReadImageNodeResult>} - result object
 */
async function ge5ReadImageNode(
  serializedImage: string,
  options: Ge5ReadImageOptions = {}
) : Promise<Ge5ReadImageNodeResult> {

  const mountDirs: Set<string> = new Set()

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonObject },
    { type: InterfaceTypes.Image },
  ]

  mountDirs.add(path.dirname(serializedImage as string))
  const inputs: Array<PipelineInput> = [
  ]

  const args = []
  // Inputs
  const serializedImageName = serializedImage
  args.push(serializedImageName as string)

  // Outputs
  const couldReadName = '0'
  args.push(couldReadName)

  const imageName = '1'
  args.push(imageName)

  // Options
  args.push('--memory-io')
  if (typeof options.informationOnly !== "undefined") {
    options.informationOnly && args.push('--information-only')
  }

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), '..', 'pipelines', 'ge5-read-image')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs, mountDirs)
  if (returnValue !== 0) {
    throw new Error(stderr)
  }

  const result = {
    couldRead: (outputs[0].data as JsonObject).data as boolean,
    image: outputs[1].data as Image,
  }
  return result
}

export default ge5ReadImageNode
