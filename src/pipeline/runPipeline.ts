import * as Comlink from 'comlink'

import createWorkerProxy from '../core/create-worker-proxy.js'
import loadEmscriptenModuleMainThread from '../core/internal/loadEmscriptenModuleMainThread.js'

import { simd } from 'wasm-feature-detect'

import config from '../itkConfig.js'

import IOTypes from '../core/IOTypes.js'
import InterfaceTypes from '../core/InterfaceTypes.js'
import runPipelineEmscripten from './internal/runPipelineEmscripten.js'
import getTransferables from '../core/get-transferables.js'
import BinaryStream from '../core/interface-types/binary-stream.js'
import BinaryFile from '../core/interface-types/binary-file.js'
import Image from '../core/interface-types/image.js'
import Mesh from '../core/interface-types/mesh.js'

import PipelineEmscriptenModule from './PipelineEmscriptenModule.js'
import PipelineOutput from './PipelineOutput.js'
import PipelineInput from './PipelineInput.js'
import RunPipelineResult from './RunPipelineResult.js'
import RunPipelineOptions from './RunPipelineOptions.js'
import meshTransferables from '../core/internal/meshTransferables.js'
import TypedArray from '../core/TypedArray.js'
import imageTransferables from '../core/internal/imageTransferables.js'
import RunPipelineWorkerResult from '../core/web-workers/run-pipeline-worker-result.js'

// To cache loaded pipeline modules
const pipelineToModule: Map<string, PipelineEmscriptenModule> = new Map()

async function loadPipelineModule (
  pipelinePath: string | URL
): Promise<PipelineEmscriptenModule> {
  let moduleRelativePathOrURL: string | URL = pipelinePath as string
  let pipeline = pipelinePath as string
  if (typeof pipelinePath !== 'string') {
    moduleRelativePathOrURL = new URL(pipelinePath.href)
    pipeline = moduleRelativePathOrURL.href
  }
  if (pipelineToModule.has(pipeline)) {
    return pipelineToModule.get(pipeline) as PipelineEmscriptenModule
  } else {
    const pipelineModule = (await loadEmscriptenModuleMainThread(
      pipelinePath,
      config.pipelinesUrl
    )) as PipelineEmscriptenModule
    pipelineToModule.set(pipeline, pipelineModule)
    return pipelineModule
  }
}

async function runPipeline (
  webWorker: Worker | null | boolean,
  pipelinePath: string | URL,
  args: string[],
  outputs: PipelineOutput[] | null,
  inputs: PipelineInput[] | null,
  options?: RunPipelineOptions
): Promise<RunPipelineResult> {
  if (!await simd()) {
    const simdErrorMessage = 'WebAssembly SIMD support is required -- please update your browser.'
    alert(simdErrorMessage)
    throw new Error(simdErrorMessage)
  }

  if (webWorker === false) {
    const pipelineModule = await loadPipelineModule(pipelinePath.toString())
    const result = runPipelineEmscripten(pipelineModule, args, outputs, inputs)
    return result
  }
  let worker = webWorker
  const pipelineWorkerUrl = options?.pipelineWorkerUrl ?? null
  const pipelineWorkerUrlString = typeof pipelineWorkerUrl !== 'string' && typeof pipelineWorkerUrl?.href !== 'undefined' ? pipelineWorkerUrl.href : pipelineWorkerUrl
  const { workerProxy, worker: usedWorker } = await createWorkerProxy(
    worker as Worker | null, pipelineWorkerUrlString as string | undefined | null
  )
  worker = usedWorker
  const transferables: Array<ArrayBuffer | TypedArray | null> = []
  if (!(inputs == null) && inputs.length > 0) {
    inputs.forEach(function (input) {
      if (input.type === InterfaceTypes.BinaryStream) {
        // Binary data
        const dataArray = (input.data as BinaryStream).data
        transferables.push(dataArray)
      } else if (input.type === InterfaceTypes.BinaryFile) {
        // Binary data
        const dataArray = (input.data as BinaryFile).data
        transferables.push(dataArray)
      } else if (input.type === InterfaceTypes.Image) {
        // Image data
        const image = input.data as Image
        if (image.data === null) {
          throw Error('image data cannot be null')
        }
        transferables.push(...imageTransferables(image))
      } else if (input.type === IOTypes.Binary) {
        // Binary data
        transferables.push(input.data as Uint8Array)
      } else if (input.type === IOTypes.Image) {
        // Image data
        const image = input.data as Image
        if (image.data === null) {
          throw Error('image data cannot be null')
        }
        transferables.push(...imageTransferables(image))
      } else if (input.type === IOTypes.Mesh) {
        // Mesh data
        const mesh = input.data as Mesh
        transferables.push(...meshTransferables(mesh))
      }
    })
  }
  const pipelineBaseUrl = options?.pipelineBaseUrl ?? 'pipelinesUrl'
  const pipelineBaseUrlString = typeof pipelineBaseUrl !== 'string' && typeof pipelineBaseUrl?.href !== 'undefined' ? pipelineBaseUrl.href : pipelineBaseUrl
  const transferedInputs = (inputs != null) ? Comlink.transfer(inputs, getTransferables(transferables)) : null
  const result: RunPipelineWorkerResult = await workerProxy.runPipeline(
    config,
    pipelinePath.toString(),
    pipelineBaseUrlString as string,
    args,
    outputs,
    transferedInputs
  )
  return {
    returnValue: result.returnValue,
    stdout: result.stdout,
    stderr: result.stderr,
    outputs: result.outputs,
    webWorker: worker
  }
}

export default runPipeline
