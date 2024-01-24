import {
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import GaussianKernelRadiusNodeOptions from './gaussian-kernel-radius-node-options.js'
import GaussianKernelRadiusNodeResult from './gaussian-kernel-radius-node-result.js'

import path from 'path'

/**
 * Radius in pixels required for effective discrete gaussian filtering.
 *
 * @param {GaussianKernelRadiusNodeOptions} options - options object
 *
 * @returns {Promise<GaussianKernelRadiusNodeResult>} - result object
 */
async function gaussianKernelRadiusNode(
  options: GaussianKernelRadiusNodeOptions = { size: [1,1], sigma: [1,1], }
) : Promise<GaussianKernelRadiusNodeResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
  ]

  const inputs: Array<PipelineInput> = [
  ]

  const args = []
  // Inputs
  // Outputs
  const radiusName = '0'
  args.push(radiusName)

  // Options
  args.push('--memory-io')
  if (typeof options.size !== "undefined") {
    if(options.size.length < 1) {
      throw new Error('"size" option must have a length > 1')
    }
    args.push('--size')

    options.size.forEach((value) => {
      args.push(value.toString())

    })
  }
  if (typeof options.sigma !== "undefined") {
    if(options.sigma.length < 1) {
      throw new Error('"sigma" option must have a length > 1')
    }
    args.push('--sigma')

    options.sigma.forEach((value) => {
      args.push(value.toString())

    })
  }
  if (typeof options.maxKernelWidth !== "undefined") {
    args.push('--max-kernel-width', options.maxKernelWidth.toString())

  }
  if (typeof options.maxKernelError !== "undefined") {
    args.push('--max-kernel-error', options.maxKernelError.toString())

  }

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), 'pipelines', 'gaussian-kernel-radius')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    radius: outputs[0]?.data as number[],
  }
  return result
}

export default gaussianKernelRadiusNode
