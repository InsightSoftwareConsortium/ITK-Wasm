// Generated file. To retain edits, remove this comment.

import {
  BinaryStream,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import CompressStringifyOptions from './compress-stringify-options.js'
import CompressStringifyResult from './compress-stringify-result.js'


import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

/**
 * Given a binary, compress and optionally base64 encode.
 *
 * @param {Uint8Array} input - Input binary
 * @param {CompressStringifyOptions} options - options object
 *
 * @returns {Promise<CompressStringifyResult>} - result object
 */
async function compressStringify(
  webWorker: null | Worker,
  input: Uint8Array,
  options: CompressStringifyOptions = {}
) : Promise<CompressStringifyResult> {

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
  if (typeof options.stringify !== "undefined") {
    options.stringify && args.push('--stringify')
  }
  if (typeof options.compressionLevel !== "undefined") {
    args.push('--compression-level', options.compressionLevel.toString())

  }
  if (typeof options.dataUrlPrefix !== "undefined") {
    args.push('--data-url-prefix', options.dataUrlPrefix.toString())

  }

  const pipelinePath = 'compress-stringify'

  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl() })
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    output: (outputs[0]?.data as BinaryStream).data,
  }
  return result
}

export default compressStringify
