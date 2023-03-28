import {
  BinaryStream,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import ParseStringDecompressOptions from './parse-string-decompress-options.js'
import ParseStringDecompressNodeResult from './parse-string-decompress-node-result.js'


import path from 'path'

/**
 * Given a binary or string produced with compress-stringify, decompress and optionally base64 decode.
 *
 * @param {Uint8Array} input - Compressed input
 *
 * @returns {Promise<ParseStringDecompressNodeResult>} - result object
 */
async function parseStringDecompressNode(
  input: Uint8Array,
  options: ParseStringDecompressOptions = {}
) : Promise<ParseStringDecompressNodeResult> {

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
  if (typeof options.parseString !== "undefined") {
    args.push('--parse-string')
  }

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), '..', 'pipelines', 'parse-string-decompress')

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

export default parseStringDecompressNode
