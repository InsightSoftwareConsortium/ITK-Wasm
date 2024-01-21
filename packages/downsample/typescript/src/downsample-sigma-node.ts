// Generated file. To retain edits, remove this comment.

import {
  JsonCompatible,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import DownsampleSigmaNodeOptions from './downsample-sigma-node-options.js'
import DownsampleSigmaNodeResult from './downsample-sigma-node-result.js'

import path from 'path'

/**
 * Compute gaussian kernel sigma values in pixel units for downsampling.
 *
 * @param {DownsampleSigmaNodeOptions} options - options object
 *
 * @returns {Promise<DownsampleSigmaNodeResult>} - result object
 */
async function downsampleSigmaNode(
  options: DownsampleSigmaNodeOptions = { shrinkFactors: [] as number[], }
) : Promise<DownsampleSigmaNodeResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
  ]

  const inputs: Array<PipelineInput> = [
  ]

  const args = []
  // Inputs
  // Outputs
  const sigmaName = '0'
  args.push(sigmaName)

  // Options
  args.push('--memory-io')
  if (typeof options.shrinkFactors !== "undefined") {
    if(options.shrinkFactors.length < 1) {
      throw new Error('"shrink-factors" option must have a length > 1')
    }
    args.push('--shrink-factors')

    options.shrinkFactors.forEach((value) => {
      args.push(value.toString())

    })
  }

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), 'pipelines', 'downsample-sigma')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    sigma: outputs[0]?.data as JsonCompatible,
  }
  return result
}

export default downsampleSigmaNode
