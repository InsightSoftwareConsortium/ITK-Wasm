import createWebworkerPromise from './createWebworkerPromise'

import config from './itkConfig'

import IOTypes from './IOTypes'
import runPipelineEmscripten from './runPipelineEmscripten'

// To cache loaded pipeline modules
const pipelinePathToModule = {}

function loadEmscriptenModuleMainThread (itkModulesPath, modulesDirectory, moduleBaseName) {
  let prefix = itkModulesPath
  if (itkModulesPath[0] !== '/' && !itkModulesPath.startsWith('http')) {
    prefix = '..'
  }
  if (typeof window.WebAssembly === 'object' && typeof window.WebAssembly.Memory === 'function') {
    const modulePath = prefix + '/' + modulesDirectory + '/' + moduleBaseName + 'Wasm.js'
    return new Promise(function (resolve, reject) {
      const s = document.createElement('script')
      s.src = modulePath
      s.onload = resolve
      s.onerror = reject
      document.head.appendChild(s)
    }).then(() => {
      const module = window[moduleBaseName]()
      return module
    })
  } else {
    const modulePath = prefix + '/' + modulesDirectory + '/' + moduleBaseName + '.js'
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

async function loadPipelineModule (moduleDirectory, pipelinePath) {
  let pipelineModule = null
  if (pipelinePath in pipelinePathToModule) {
    pipelineModule = pipelinePathToModule[pipelinePath]
  } else {
    pipelinePathToModule[pipelinePath] = await loadEmscriptenModuleMainThread(config.itkModulesPath, moduleDirectory, pipelinePath)
    pipelineModule = pipelinePathToModule[pipelinePath]
  }
  return pipelineModule
}

const haveSharedArrayBuffer = typeof window.SharedArrayBuffer === 'function'
function getTransferable (data) {
  let result = null
  if (data.buffer) {
    result = data.buffer
  } else if (data.byteLength) {
    result = data
  }
  if (!!result && haveSharedArrayBuffer && result instanceof SharedArrayBuffer) { // eslint-disable-line
    result = null
  }
  return result
}

const runPipelineBrowser = (webWorker, pipelinePath, args, outputs, inputs) => {
  if (webWorker === false) {
    loadPipelineModule('Pipelines', pipelinePath).then((pipelineModule) => {
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
          // Binary data
          if (input.type === IOTypes.Binary) {
            const transferable = getTransferable(input.data)
            if (transferable) {
              transferables.push(transferable)
            }
          }
          // Image data
          if (input.type === IOTypes.Image) {
            const transferable = getTransferable(input.data.data)
            if (transferable) {
              transferables.push(transferable)
            }
          }
          // Mesh data
          if (input.type === IOTypes.Mesh) {
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
          pipelinePath,
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
