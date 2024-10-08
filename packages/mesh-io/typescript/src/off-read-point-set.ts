// Generated file. To retain edits, remove this comment.

import {
  BinaryFile,
  JsonCompatible,
  PointSet,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import OffReadPointSetOptions from './off-read-point-set-options.js'
import OffReadPointSetResult from './off-read-point-set-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Read a point set file format and convert it to the itk-wasm file format
 *
 * @param {File | BinaryFile} serializedPointSet - Input point set serialized in the file format
 * @param {OffReadPointSetOptions} options - options object
 *
 * @returns {Promise<OffReadPointSetResult>} - result object
 */
async function offReadPointSet(
  serializedPointSet: File | BinaryFile,
  options: OffReadPointSetOptions = {}
) : Promise<OffReadPointSetResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
    { type: InterfaceTypes.PointSet },
  ]

  let serializedPointSetFile = serializedPointSet
  if (serializedPointSet instanceof File) {
    const serializedPointSetBuffer = await serializedPointSet.arrayBuffer()
    serializedPointSetFile = { path: serializedPointSet.name, data: new Uint8Array(serializedPointSetBuffer) }
  }
  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.BinaryFile, data: serializedPointSetFile as BinaryFile },
  ]

  const args = []
  // Inputs
  const serializedPointSetName = (serializedPointSetFile as BinaryFile).path
  args.push(serializedPointSetName)

  // Outputs
  const couldReadName = '0'
  args.push(couldReadName)

  const pointSetName = '1'
  args.push(pointSetName)

  // Options
  args.push('--memory-io')
  if (options.informationOnly) {
    options.informationOnly && args.push('--information-only')
  }

  const pipelinePath = 'off-read-point-set'

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
    couldRead: outputs[0]?.data as JsonCompatible,
    pointSet: outputs[1]?.data as PointSet,
  }
  return result
}

export default offReadPointSet
