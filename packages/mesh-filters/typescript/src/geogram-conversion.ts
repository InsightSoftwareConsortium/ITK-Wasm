// Generated file. To retain edits, remove this comment.

import {
  Mesh,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import GeogramConversionOptions from './geogram-conversion-options.js'
import GeogramConversionResult from './geogram-conversion-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * A test for reading and writing with geogram, itk::QuadEdgeMesh meshes
 *
 * @param {Mesh} inputMesh - The input mesh
 * @param {GeogramConversionOptions} options - options object
 *
 * @returns {Promise<GeogramConversionResult>} - result object
 */
async function geogramConversion(
  inputMesh: Mesh,
  options: GeogramConversionOptions = {}
) : Promise<GeogramConversionResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.Mesh },
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.Mesh, data: inputMesh },
  ]

  const args = []
  // Inputs
  const inputMeshName = '0'
  args.push(inputMeshName)

  // Outputs
  const outputMeshName = '0'
  args.push(outputMeshName)

  // Options
  args.push('--memory-io')

  const pipelinePath = 'geogram-conversion'

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
    outputMesh: outputs[0]?.data as Mesh,
  }
  return result
}

export default geogramConversion
