import createWebWorkerPromise from '../core/createWebWorkerPromise.js'
import loadEmscriptenModuleMainThread from '../core/internal/loadEmscriptenModuleMainThread.js'

import config from '../itkConfig.js'

import IOTypes from '../core/IOTypes.js'
import InterfaceTypes from '../core/InterfaceTypes.js'
import runPipelineEmscripten from './internal/runPipelineEmscripten.js'
import getTransferables from '../core/getTransferables.js'
import BinaryStream from '../core/BinaryStream.js'
import BinaryFile from '../core/BinaryFile.js'
import Image from '../core/Image.js'
import Mesh from '../core/Mesh.js'

import PipelineEmscriptenModule from './PipelineEmscriptenModule.js'
import PipelineOutput from './PipelineOutput.js'
import PipelineInput from './PipelineInput.js'
import RunPipelineResult from './RunPipelineResult.js'
import RunPipelineOptions from './RunPipelineOptions.js'
import meshTransferables from '../core/internal/meshTransferables.js'
import TypedArray from '../core/TypedArray.js'
import imageTransferables from '../core/internal/imageTransferables.js'

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
  if (webWorker === false) {
    const pipelineModule = await loadPipelineModule(pipelinePath.toString())
    const result = runPipelineEmscripten(pipelineModule, args, outputs, inputs)
    return result
  }
  let worker = webWorker
  const pipelineWorkerUrl = options?.pipelineWorkerUrl
  const pipelineWorkerUrlString = typeof pipelineWorkerUrl !== 'string' && typeof pipelineWorkerUrl?.href !== 'undefined' ? pipelineWorkerUrl.href : pipelineWorkerUrl
  const { webworkerPromise, worker: usedWorker } = await createWebWorkerPromise(
    worker as Worker | null, pipelineWorkerUrlString as string | undefined | null
  )
  worker = usedWorker
  const transferables: (ArrayBuffer | TypedArray | null)[] = []
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
  interface RunPipelineWorkerResult {
    returnValue: number
    stdout: string
    stderr: string
    outputs: PipelineOutput[]
  }
  const pipelineBaseUrl = options?.pipelineBaseUrl ?? 'pipelinesUrl'
  const pipelineBaseUrlString = typeof pipelineBaseUrl !== 'string' && typeof pipelineBaseUrl?.href !== 'undefined' ? pipelineBaseUrl.href : pipelineBaseUrl
  const result: RunPipelineWorkerResult = await webworkerPromise.postMessage(
    {
      operation: 'runPipeline',
      config: config,
      pipelinePath: pipelinePath.toString(),
      pipelineBaseUrl: pipelineBaseUrlString,
      args,
      outputs,
      inputs
    },
    getTransferables(transferables)
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
