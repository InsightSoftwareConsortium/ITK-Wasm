import loadEmscriptenModuleNode from './internal/load-emscripten-module-node.js'
import runPipelineEmscripten from './internal/run-pipeline-emscripten.js'

import PipelineEmscriptenModule from './pipeline-emscripten-module.js'
import PipelineOutput from './pipeline-output.js'
import PipelineInput from './pipeline-input.js'
import RunPipelineResult from './run-pipeline-result.js'

async function runPipelineNode (
  pipelinePath: string,
  args: string[],
  outputs: PipelineOutput[],
  inputs: PipelineInput[] | null,
  mountDirs?: Set<string>
): Promise<RunPipelineResult> {
  const Module = (await loadEmscriptenModuleNode(
    pipelinePath
  )) as PipelineEmscriptenModule
  const mountedDirs: Set<string> = new Set()
  if (typeof mountDirs !== 'undefined') {
    mountDirs.forEach((dir) => {
      mountedDirs.add(Module.mountDir(dir))
    })
  }
  const result = runPipelineEmscripten(Module, args, outputs, inputs)
  if (typeof mountDirs !== 'undefined') {
    mountedDirs.forEach((dir) => {
      Module.unmountDir(dir)
    })
  }
  return result
}

export default runPipelineNode
