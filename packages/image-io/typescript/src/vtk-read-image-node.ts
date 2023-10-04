// Generated file. To retain edits, remove this comment.

import {
  JsonCompatible,
  Image,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import VtkReadImageOptions from './vtk-read-image-options.js'
import VtkReadImageNodeResult from './vtk-read-image-node-result.js'


import path from 'path'

/**
 * Read an image file format and convert it to the itk-wasm file format
 *
 * @param {string} serializedImage - Input image serialized in the file format
 * @param {VtkReadImageOptions} options - options object
 *
 * @returns {Promise<VtkReadImageNodeResult>} - result object
 */
async function vtkReadImageNode(
  serializedImage: string,
  options: VtkReadImageOptions = {}
) : Promise<VtkReadImageNodeResult> {

  const mountDirs: Set<string> = new Set()

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
    { type: InterfaceTypes.Image },
  ]

  mountDirs.add(path.dirname(serializedImage as string))
  const inputs: Array<PipelineInput> = [
  ]

  const args = []
  // Inputs
  const serializedImageName = serializedImage
  args.push(serializedImageName)
  mountDirs.add(path.dirname(serializedImageName))

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

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), '..', 'pipelines', 'vtk-read-image')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs, mountDirs)
  if (returnValue !== 0) {
    throw new Error(stderr)
  }

  const result = {
    couldRead: outputs[0].data as JsonCompatible,
    image: outputs[1].data as Image,
  }
  return result
}

export default vtkReadImageNode
