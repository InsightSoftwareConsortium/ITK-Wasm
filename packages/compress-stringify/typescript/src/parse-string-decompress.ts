import {
  BinaryStream,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import ParseStringDecompressOptions from './parse-string-decompress-options.js'
import ParseStringDecompressResult from './parse-string-decompress-result.js'


import { getPipelinesBaseUrl } from './pipelines-base-url.js'


import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

/**
 * Given a binary or string produced with compress-stringify, decompress and optionally base64 decode.
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

  const pipelinePath = 'parse-string-decompress'

  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl() })
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
