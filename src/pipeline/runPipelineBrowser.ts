import axios from 'axios'

import createWebworkerPromise from '../core/internal/createWebworkerPromise.js'
import loadEmscriptenModuleMainThread from '../core/internal/loadEmscriptenModuleMainThread.js'

import config from '../itkConfig.js'

import IOTypes from '../core/IOTypes.js'
import runPipelineEmscripten from './internal/runPipelineEmscripten.js'
import getTransferable from '../core/getTransferable.js'
import Image from '../core/Image.js'
import Mesh from '../core/Mesh.js'

import PipelineEmscriptenModule from './PipelineEmscriptenModule.js'
import PipelineOutput from './PipelineOutput.js'
import PipelineInput from './PipelineInput.js'
import RunPipelineResult from './RunPipelineResult.js'

// To cache loaded pipeline modules
const pipelineToModule: Map<string, PipelineEmscriptenModule> = new Map()

async function loadPipelineModule (pipelinePath: string | URL): Promise<PipelineEmscriptenModule> {
  let moduleRelativePathOrURL: string | URL = pipelinePath as string
  let pipeline = pipelinePath as string
  const pipelineModule = null
  if (typeof pipelinePath !== 'string') {
    moduleRelativePathOrURL = new URL((pipelinePath).href)
    pipeline = moduleRelativePathOrURL.href
  }
  if (pipelineToModule.has(pipeline)) {
    return pipelineToModule.get(pipeline) as PipelineEmscriptenModule
  } else {
    const pipelineModule = await loadEmscriptenModuleMainThread(pipelinePath, 'pipeline', config.itkModulesPath) as PipelineEmscriptenModule
    pipelineToModule.set(pipeline, pipelineModule)
    return pipelineModule
  }
}

async function runPipelineBrowser (webWorker: Worker | null | boolean, pipelinePath: string | URL, args: string[], outputs: PipelineOutput[], inputs: PipelineInput[]): Promise<RunPipelineResult> {
  if (webWorker === false) {
    const pipelineModule = await loadPipelineModule(pipelinePath.toString())
    const result = runPipelineEmscripten(pipelineModule, args, outputs, inputs)
    return result
  }
  let worker = webWorker
  const { webworkerPromise, worker: usedWorker } = await createWebworkerPromise('pipeline', worker as Worker | null)
  worker = usedWorker
  const transferables: ArrayBuffer[] = []
  if (inputs) {
    inputs.forEach(function (input) {
      if (input.type === IOTypes.Binary) {
        // Binary data
        const transferable = getTransferable(input.data as Uint8Array)
        if (transferable != null) {
          transferables.push(transferable)
        }
      } else if (input.type === IOTypes.Image) {
        // Image data
        const image = input.data as Image
        if (image.data === null) {
          throw Error('image data cannot be null')
        }
        const transferable = getTransferable(image.data)
        if (transferable != null) {
          transferables.push(transferable)
        }
      } else if (input.type === IOTypes.Mesh) {
        // Mesh data
        const mesh = input.data as Mesh
        if (mesh.points != null) {
          const transferable = getTransferable(mesh.points)
          if (transferable != null) {
            transferables.push(transferable)
          }
        }
        if (mesh.pointData != null) {
          const transferable = getTransferable(mesh.pointData)
          if (transferable != null) {
            transferables.push(transferable)
          }
        }
        if (mesh.cells != null) {
          const transferable = getTransferable(mesh.cells)
          if (transferable != null) {
            transferables.push(transferable)
          }
        }
        if (mesh.cellData != null) {
          const transferable = getTransferable(mesh.cellData)
          if (transferable != null) {
            transferables.push(transferable)
          }
        }
      }
    })
  }
  interface RunPipelineWorkerResult {
    stdout: string
    stderr: string
    outputs: PipelineOutput[]
  }
  const result: RunPipelineWorkerResult = await webworkerPromise.postMessage(
    {
      operation: 'runPipeline',
      config: config,
      pipelinePath: pipelinePath.toString(),
      args,
      outputs,
      inputs
    },
    transferables
  )
  return { stdout: result.stdout, stderr: result.stderr, outputs: result.outputs, webWorker: worker }
}

export default runPipelineBrowser
