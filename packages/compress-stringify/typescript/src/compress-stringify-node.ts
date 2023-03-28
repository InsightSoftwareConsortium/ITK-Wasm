import {
  BinaryStream,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import CompressStringifyOptions from './compress-stringify-options.js'
import CompressStringifyNodeResult from './compress-stringify-node-result.js'


import path from 'path'

/**
 * Given a binary, compress and optionally base64 encode.
 *
 * @param {Uint8Array} input - Input binary
 *
 * @returns {Promise<CompressStringifyNodeResult>} - result object
 */
async function compressStringifyNode(
  input: Uint8Array,
  options: CompressStringifyOptions = {}
) : Promise<CompressStringifyNodeResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.BinaryStream },
  ]
  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.BinaryStream, data: { data: input }  },
  ]

  const args = []
  // Inputs
  args.push('0')
  // Outputs
  args.push('0')
  // Options
  args.push('--memory-io')
  if (typeof options.stringify !== "undefined") {
    args.push('--stringify')
  }
  if (typeof options.compressionLevel !== "undefined") {
    args.push('--compression-level', options.compressionLevel.toString())
  }
  if (typeof options.dataUrlPrefix !== "undefined") {
    args.push('--data-url-prefix', options.dataUrlPrefix.toString())
  }

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), '..', 'pipelines', 'compress-stringify')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0) {
    throw new Error(stderr)
  }

  const result = {
    output: (outputs[0].data as BinaryStream).data,
  }
  return result
}

export default compressStringifyNode
