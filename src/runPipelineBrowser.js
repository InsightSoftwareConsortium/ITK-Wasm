import createWebworkerPromise from './createWebworkerPromise'

import config from './itkConfig'

import IOTypes from './IOTypes'

const runPipelineBrowser = (webWorker, pipelinePath, args, outputs, inputs) => {
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
