import fs from 'fs'
import loadEmscriptenModule from '../core/internal/loadEmscriptenModuleNode.js'
import runPipelineEmscripten from './internal/runPipelineEmscripten.js'

import PipelineEmscriptenModule from './PipelineEmscriptenModule.js'
import PipelineOutput from './PipelineOutput.js'
import PipelineInput from './PipelineInput.js'
import RunPipelineResult from './RunPipelineResult.js'

async function runPipelineNode(pipelinePath: string, args: string[], outputs: PipelineOutput[], inputs: PipelineInput[]): Promise<RunPipelineResult> {
  const wasmBinary = fs.readFileSync(pipelinePath + '.wasm')
  const Module = await loadEmscriptenModule(pipelinePath + '.js', wasmBinary) as PipelineEmscriptenModule
  const result = runPipelineEmscripten(Module, args, outputs, inputs)
  return result
}

export default runPipelineNode
