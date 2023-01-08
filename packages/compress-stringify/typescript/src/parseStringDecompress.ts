import {
  BinaryStream,
  InterfaceTypes,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import ParseStringDecompressOptions from './ParseStringDecompressOptions.js'
import ParseStringDecompressResult from './ParseStringDecompressResult.js'

/**
 * Given a binary or string produced with CompressedStringify, decompress and optionally base64 decode.
 *
 * @param {Uint8Array} input - Compressed input
 *
 * @returns {Promise<ParseStringDecompressResult>} - result object
 */
async function parseStringDecompress(
  webWorker: null | Worker,
  input: Uint8Array,
  options: ParseStringDecompressOptions = {}
) : Promise<ParseStringDecompressResult> {

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
  if (options.parseString) {
    args.push('--parse-string')
  }

  const pipelinePath = 'parse-string-decompress'

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

export default parseStringDecompress
