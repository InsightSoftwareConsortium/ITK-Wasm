import {
  BinaryStream,
  InterfaceTypes,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import CompressStringifyOptions from './CompressStringifyOptions.js'
import CompressStringifyResult from './CompressStringifyResult.js'

/**
 * Given a binary, compress and optionally base64 encode.
 *
 * @param {Uint8Array} input - Input binary
 *
 * @returns {Promise<CompressStringifyResult>} - result object
 */
async function compressStringify(
  webWorker: null | Worker,
  input: Uint8Array,
  options: CompressStringifyOptions = {}
) : Promise<CompressStringifyResult> {

  const desiredOutputs = [
    { type: InterfaceTypes.BinaryStream },
  ]
  const inputs: [ PipelineInput ] = [
    { type: InterfaceTypes.BinaryStream, data: input },
  ]

  const args = []
  // Inputs
  args.push('0')
  // Outputs
  args.push('0')
  // Options
  args.push('--memory-io')
  if (options.stringify) {
    args.push('--stringify')
  }
  if (options.compressionLevel) {
    args.push('--compression-level', options.compressionLevel.toString())
  }
  if (options.dataUrlPrefix) {
    args.push('--data-url-prefix', options.dataUrlPrefix.toString())
  }

  const pipelinePath = 'compress-stringify'

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
    output: (outputs[0].data as BinaryStream).data,
  }
  return result
}

export default compressStringify
