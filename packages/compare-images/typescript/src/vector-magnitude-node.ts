// Generated file. To retain edits, remove this comment.

import {
  Image,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import VectorMagnitudeNodeResult from './vector-magnitude-node-result.js'


import path from 'path'

/**
 * Generate a scalar magnitude image based on the input vector's norm.
 *
 * @param {Image} vectorImage - Input vector image
 *
 * @returns {Promise<VectorMagnitudeNodeResult>} - result object
 */
async function vectorMagnitudeNode(
  vectorImage: Image

) : Promise<VectorMagnitudeNodeResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.Image },
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.Image, data: vectorImage },
  ]

  const args = []
  // Inputs
  const vectorImageName = '0'
  args.push(vectorImageName as string)

  // Outputs
  const magnitudeImageName = '0'
  args.push(magnitudeImageName)

  // Options
  args.push('--memory-io')

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), '..', 'pipelines', 'vector-magnitude')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0) {
    throw new Error(stderr)
  }

  const result = {
    magnitudeImage: outputs[0].data as Image,
  }
  return result
}

export default vectorMagnitudeNode
