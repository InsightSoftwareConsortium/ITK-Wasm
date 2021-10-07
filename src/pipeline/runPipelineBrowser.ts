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
  const moduleRelativePathOrURL = pipelinePath
  let pipeline = pipelinePath as string
  let pipelineModule = null
  if (typeof pipelinePath !== 'string') {
    pipeline = pipelinePath.href
  }
  if (pipelineToModule.has(pipeline)) {
    return pipelineToModule.get(pipeline) as PipelineEmscriptenModule
  } else {
    const pipelineModule = await loadEmscriptenModuleMainThread(pipelinePath, 'pipeline', config.itkModulesPath) as PipelineEmscriptenModule
    pipelineToModule.set(pipeline, pipelineModule)
    return pipelineModule
  }
}

function runPipelineBrowser(webWorker: Worker | null | boolean, pipelinePath: string | URL, args: string[], outputs: PipelineOutput[], inputs: PipelineInput[]): Promise<RunPipelineResult> {
  if (webWorker === false) {
    loadPipelineModule(pipelinePath.toString()).then((pipelineModule) => {
      const result = runPipelineEmscripten(pipelineModule, args, outputs, inputs)
      return result
    })
  }
  let worker = webWorker
  return createWebworkerPromise('pipeline', worker as Worker | null)
    .then(({ webworkerPromise, worker: usedWorker }) => {
      worker = usedWorker
      const transferables: ArrayBuffer[] = []
      if (inputs) {
        inputs.forEach(function (input) {
          if (input.type === IOTypes.Binary) {
            // Binary data
            const transferable = getTransferable(input.data as Uint8Array)
            if (transferable) {
              transferables.push(transferable)
            }
          } else if (input.type === IOTypes.Image) {
            // Image data
            const image = input.data as Image
            if (image.data === null) {
              throw Error('image data cannot be null')
            }
            const transferable = getTransferable(image.data)
            if (transferable) {
              transferables.push(transferable)
            }
          } else if (input.type === IOTypes.Mesh) {
            // Mesh data
            const mesh = input.data as Mesh
            if (mesh.points) {
              const transferable = getTransferable(mesh.points)
              if (transferable) {
                transferables.push(transferable)
              }
            }
            if (mesh.pointData) {
              const transferable = getTransferable(mesh.pointData)
              if (transferable) {
                transferables.push(transferable)
              }
            }
            if (mesh.cells) {
              const transferable = getTransferable(mesh.cells)
              if (transferable) {
                transferables.push(transferable)
              }
            }
            if (mesh.cellData) {
              const transferable = getTransferable(mesh.cellData)
              if (transferable) {
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
      return webworkerPromise.postMessage(
        {
          operation: 'runPipeline',
          config: config,
          pipelinePath: pipelinePath.toString(),
          args,
          outputs,
          inputs
        },
        transferables
      ).then(function (result: RunPipelineWorkerResult) {
        return Promise.resolve({ stdout: result.stdout, stderr: result.stderr, outputs: result.outputs, webWorker: worker })
      })
    })
}

export default runPipelineBrowser
