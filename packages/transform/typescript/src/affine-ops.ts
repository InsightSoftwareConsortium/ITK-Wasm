// Generated file. To retain edits, remove this comment.

import {
  TransformList,
  JsonCompatible,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import AffineOpsOptions from './affine-ops-options.js'
import AffineOpsResult from './affine-ops-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Apply operations to an affine transform
 *
 * @param {TransformList} inputTransform - The input affine transform
 * @param {JsonCompatible} operations - JSON array of operations to apply
 * @param {AffineOpsOptions} options - options object
 *
 * @returns {Promise<AffineOpsResult>} - result object
 */
async function affineOps(
  inputTransform: TransformList,
  operations: JsonCompatible,
  options: AffineOpsOptions = {}
) : Promise<AffineOpsResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.TransformList },
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.TransformList, data: inputTransform },
    { type: InterfaceTypes.JsonCompatible, data: operations as JsonCompatible  },
  ]

  const args = []
  // Inputs
  const inputTransformName = '0'
  args.push(inputTransformName)

  const operationsName = '1'
  args.push(operationsName)

  // Outputs
  const outputTransformName = '0'
  args.push(outputTransformName)

  // Options
  args.push('--memory-io')

  const pipelinePath = 'affine-ops'

  let workerToUse = options?.webWorker
  if (workerToUse === undefined) {
    workerToUse = await getDefaultWebWorker()
  }
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl(), webWorker: workerToUse, noCopy: options?.noCopy })
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    outputTransform: outputs[0]?.data as TransformList,
  }
  return result
}

export default affineOps
