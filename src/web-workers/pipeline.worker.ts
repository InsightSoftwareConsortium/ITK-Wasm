import registerWebworker from 'webworker-promise/lib/register.js'

import PipelineEmscriptenModule from '../pipeline/PipelineEmscriptenModule.js'

import { RunPipelineInput, loadPipelineModule, runPipeline } from "./pipeline-operations.js"

registerWebworker(async function (input: RunPipelineInput) {
  let pipelineModule = null
  if (input.operation === 'runPipeline') {
    pipelineModule = await loadPipelineModule('pipeline', input.pipelinePath, input.config) as PipelineEmscriptenModule
  } else if (input.operation === 'runPolyDataIOPipeline') {
    pipelineModule = await loadPipelineModule('polydata-io', input.pipelinePath, input.config) as PipelineEmscriptenModule
  } else {
    throw new Error('Unknown worker operation')
  }
  return runPipeline(pipelineModule, input.args, input.outputs, input.inputs)
})
