// Generated file. To retain edits, remove this comment.

import {
  BinaryStream,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import ParseStringDecompressNodeOptions from './parse-string-decompress-node-options.js'
import ParseStringDecompressNodeResult from './parse-string-decompress-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Given a binary or string produced with compress-stringify, decompress and optionally base64 decode.
 *
 * @param {Uint8Array} input - Compressed input
 * @param {ParseStringDecompressNodeOptions} options - options object
 *
 * @returns {Promise<ParseStringDecompressNodeResult>} - result object
 */
async function parseStringDecompressNode(
  input: Uint8Array,
  options: ParseStringDecompressNodeOptions = {}
) : Promise<ParseStringDecompressNodeResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.BinaryStream },
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.BinaryStream, data: { data: input }  },
  ]

  const args = []
  // Inputs
  const inputName = '0'
  args.push(inputName)

  // Outputs
  const outputName = '0'
  args.push(outputName)

  // Options
  args.push('--memory-io')
  if (options.parseString) {
    options.parseString && args.push('--parse-string')
  }

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'parse-string-decompress')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    output: (outputs[0]?.data as BinaryStream).data,
  }
  return result
}

export default parseStringDecompressNode
