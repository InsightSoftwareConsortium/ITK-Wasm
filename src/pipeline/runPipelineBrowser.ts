import axios from 'axios'

import createWebworkerPromise from '../core/internal/createWebworkerPromise.js'

import config from '../itkConfig'

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
const pipelinePathToModule: Map<string, PipelineEmscriptenModule> = new Map()

function loadEmscriptenModuleMainThread (itkModulesPath: string, modulesDirectory: string, pipelinePath: string, isAbsoluteURL: boolean): Promise<PipelineEmscriptenModule> {
  let prefix = itkModulesPath
  if (itkModulesPath[0] !== '/' && !itkModulesPath.startsWith('http')) {
    prefix = '..'
  }
  const moduleScriptDir = prefix + '/' + modulesDirectory
  if (typeof window.WebAssembly === 'object' && typeof window.WebAssembly.Memory === 'function') {
    let modulePath = moduleScriptDir + '/' + pipelinePath + 'Wasm.js'
    if (isAbsoluteURL) {
      modulePath = pipelinePath + 'Wasm.js'
    }
    return new Promise(function (resolve, reject) {
      const s = document.createElement('script')
      s.src = modulePath
      s.onload = resolve
      s.onerror = reject
      document.head.appendChild(s)
    }).then(async () => {
      const moduleBaseName = pipelinePath.replace(/.*\//, '')
      let wasmPath = moduleScriptDir + '/' + pipelinePath + 'Wasm.wasm'
      if (isAbsoluteURL) {
        wasmPath = pipelinePath + 'Wasm.wasm'
      }
      const response = await axios.get(wasmPath, { responseType: 'arraybuffer' })
      const wasmBinary = response.data
      // @ts-ignore: error TS7015: Element implicitly has an 'any' type
        // because index expression is not of type 'number'.
      return Promise.resolve(window[moduleBaseName]({ moduleScriptDir, isAbsoluteURL, pipelinePath, wasmBinary }))
    })
  } else {
    let modulePath = moduleScriptDir + '/' + pipelinePath + '.js'
    if (isAbsoluteURL) {
      modulePath = pipelinePath + '.js'
    }
    return new Promise(function (resolve, reject) {
      const s = document.createElement('script')
      s.src = modulePath
      s.onload = resolve
      s.onerror = reject
      document.head.appendChild(s)
    }).then(() => {
      // @ts-ignore: error TS2551: Property 'Module' does not exist on type
      // 'Window & typeof globalThis'. Did you mean 'module'?
      const emscriptenModule = window.Module
      return emscriptenModule
    })
  }
}

async function loadPipelineModule (moduleDirectory: string, pipelinePath: string, isAbsoluteURL: boolean): Promise<PipelineEmscriptenModule> {
  if (pipelinePathToModule.has(pipelinePath)) {
    return pipelinePathToModule.get(pipelinePath) as PipelineEmscriptenModule
  } else {
    const pipelineModule = await loadEmscriptenModuleMainThread(config.itkModulesPath, moduleDirectory, pipelinePath, isAbsoluteURL) as PipelineEmscriptenModule
    pipelinePathToModule.set(pipelinePath, pipelineModule)
    return pipelineModule
  }
}

function runPipelineBrowser(webWorker: Worker | null | boolean, pipelinePath: string | URL, args: string[], outputs: PipelineOutput[], inputs: PipelineInput[]): Promise<RunPipelineResult> {
  const isAbsoluteURL = pipelinePath instanceof URL
  if (webWorker === false) {
    loadPipelineModule('Pipelines', pipelinePath.toString(), isAbsoluteURL).then((pipelineModule) => {
      const result = runPipelineEmscripten(pipelineModule, args, outputs, inputs)
      return result
    })
  }
  let worker = webWorker
  return createWebworkerPromise('Pipeline', worker as Worker | null)
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
          isAbsoluteURL,
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
