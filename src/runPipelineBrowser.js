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
            if (input.data.buffer) {
              transferables.push(input.data.buffer)
            } else if (input.data.byteLength) {
              transferables.push(input.data)
            }
          }
          // Image data
          if (input.type === IOTypes.Image) {
            if (input.data.data.buffer) {
              transferables.push(input.data.data.buffer)
            } else if (input.data.data.byteLength) {
              transferables.push(input.data.data)
            }
          }
          // Mesh data
          if (input.type === IOTypes.Mesh) {
            if (input.data.points) {
              if (input.data.points.buffer) {
                transferables.push(input.data.points.buffer)
              } else if (input.data.points.byteLength) {
                transferables.push(input.data.points)
              }
            }
            if (input.data.pointData) {
              if (input.data.pointData.buffer) {
                transferables.push(input.data.pointData.buffer)
              } else if (input.data.pointData.byteLength) {
                transferables.push(input.data.pointData)
              }
            }
            if (input.data.cells) {
              if (input.data.cells.buffer) {
                transferables.push(input.data.cells.buffer)
              } else if (input.data.cells.byteLength) {
                transferables.push(input.data.cells)
              }
            }
            if (input.data.cellData) {
              if (input.data.cellData.buffer) {
                transferables.push(input.data.cellData.buffer)
              } else if (input.data.cellData.byteLength) {
                transferables.push(input.data.cellData)
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
