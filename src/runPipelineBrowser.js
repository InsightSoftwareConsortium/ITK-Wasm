import WebworkerPromise from 'webworker-promise'

import config from './itkConfig'

import IOTypes from './IOTypes'

const worker = new window.Worker(
  config.itkModulesPath + '/WebWorkers/Pipeline.worker.js'
)
const promiseWorker = new WebworkerPromise(worker)

const runPipelineBrowser = (pipelinePath, args, outputs, inputs) => {
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
    })
  }
  return promiseWorker.postMessage(
    {
      operation: 'runPipeline',
      config: config,
      pipelinePath,
      args,
      outputs,
      inputs
    },
    transferables
  )
}

export default runPipelineBrowser
