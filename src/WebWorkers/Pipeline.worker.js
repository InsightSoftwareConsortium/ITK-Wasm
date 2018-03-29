import registerWebworker from 'webworker-promise/lib/register'

import loadEmscriptenModule from '../loadEmscriptenModuleBrowser'
import runPipelineEmscripten from '../runPipelineEmscripten'
import IOTypes from '../IOTypes'

// To cache loaded pipeline modules
let pipelinePathToModule = {}

const runPipeline = (pipelinePath, args, outputs, inputs, config) => {
  let pipelineModule = null
  if (pipelinePath in pipelinePathToModule) {
    pipelineModule = pipelinePathToModule[pipelinePath]
  } else {
    pipelinePathToModule[pipelinePath] = loadEmscriptenModule(config.itkModulesPath, 'Pipelines', pipelinePath)
    pipelineModule = pipelinePathToModule[pipelinePath]
  }
  const result = runPipelineEmscripten(pipelineModule, args, outputs, inputs)

  const transferables = []
  if (result.outputs) {
    result.outputs.forEach(function (output) {
      // Binary data
      if (output.type === IOTypes.Binary) {
        if (output.data.buffer) {
          transferables.push(output.data.buffer)
        } else if (output.data.byteLength) {
          transferables.push(output.data)
        }
      }
      // Image data
      if (output.type === IOTypes.Image) {
        if (output.data.data.buffer) {
          transferables.push(output.data.data.buffer)
        } else if (output.data.data.byteLength) {
          transferables.push(output.data.data)
        }
      }
    })
  }

  return new registerWebworker.TransferableResponse(result, transferables)
}

registerWebworker(function (input) {
  if (input.operation === 'runPipeline') {
    return Promise.resolve(runPipeline(input.pipelinePath, input.args, input.outputs, input.inputs, input.config))
  } else {
    return Promise.resolve(new Error('Unknown worker operation'))
  }
})
