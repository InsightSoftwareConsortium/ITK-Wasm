import axios from 'axios'

import createWebworkerPromise from './createWebworkerPromise'

import config from './itkConfig'

import IOTypes from './IOTypes'
import runPipelineEmscripten from './runPipelineEmscripten'
import getTransferable from './getTransferable'

// To cache loaded pipeline modules
const pipelinePathToModule = {}

function loadEmscriptenModuleMainThread (itkModulesPath, modulesDirectory, pipelinePath, isAbsoluteURL) {
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
      const module = window.Module
      return module
    })
  }
}

async function loadPipelineModule (moduleDirectory, pipelinePath, isAbsoluteURL) {
  let pipelineModule = null
  if (pipelinePath in pipelinePathToModule) {
    pipelineModule = pipelinePathToModule[pipelinePath]
  } else {
    pipelinePathToModule[pipelinePath] = await loadEmscriptenModuleMainThread(config.itkModulesPath, moduleDirectory, pipelinePath, isAbsoluteURL)
    pipelineModule = pipelinePathToModule[pipelinePath]
  }
  return pipelineModule
}

const runPipelineBrowser = (webWorker, pipelinePath, args, outputs, inputs) => {
  const isAbsoluteURL = pipelinePath instanceof URL
  if (webWorker === false) {
    loadPipelineModule('Pipelines', pipelinePath.toString(), isAbsoluteURL).then((pipelineModule) => {
      const result = runPipelineEmscripten(pipelineModule, args, outputs, inputs)
      return result
    })
  }
  let worker = webWorker
  return createWebworkerPromise('Pipeline', worker)
    .then(({ webworkerPromise, worker: usedWorker }) => {
      worker = usedWorker
      const transferables = []
      if (inputs) {
        inputs.forEach(function (input) {
          if (input.type === IOTypes.Binary) {
            // Binary data
            const transferable = getTransferable(input.data)
            if (transferable) {
              transferables.push(transferable)
            }
          } else if (input.type === IOTypes.Image) {
            // Image data
            const transferable = getTransferable(input.data.data)
            if (transferable) {
              transferables.push(transferable)
            }
          } else if (input.type === IOTypes.Mesh) {
            // Mesh data
            if (input.data.points) {
              const transferable = getTransferable(input.data.points)
              if (transferable) {
                transferables.push(transferable)
              }
            }
            if (input.data.pointData) {
              const transferable = getTransferable(input.data.pointData)
              if (transferable) {
                transferables.push(transferable)
              }
            }
            if (input.data.cells) {
              const transferable = getTransferable(input.data.cells)
              if (transferable) {
                transferables.push(transferable)
              }
            }
            if (input.data.cellData) {
              const transferable = getTransferable(input.data.cellData)
              if (transferable) {
                transferables.push(transferable)
              }
            }
          }
        })
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
      ).then(function ({ stdout, stderr, outputs }) {
        return Promise.resolve({ stdout, stderr, outputs, webWorker: worker })
      })
    })
}

export default runPipelineBrowser
