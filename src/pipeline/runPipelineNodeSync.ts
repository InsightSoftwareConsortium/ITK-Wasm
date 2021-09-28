import loadEmscriptenModule from '../core/internal/loadEmscriptenModuleNode.js'
import runPipelineEmscripten from './internal/runPipelineEmscripten.js'

import PipelineEmscriptenModule from './PipelineEmscriptenModule.js'
import PipelineOutput from './PipelineOutput.js'
import PipelineInput from './PipelineInput.js'
import RunPipelineResult from './RunPipelineResult.js'

function runPipelineNodeSync(pipelinePath: string, args: string[], outputs: PipelineOutput[], inputs: PipelineInput[]): RunPipelineResult {
  const Module = loadEmscriptenModule(pipelinePath) as PipelineEmscriptenModule
  const result = runPipelineEmscripten(Module, args, outputs, inputs)
  return result
}

export default runPipelineNodeSync
