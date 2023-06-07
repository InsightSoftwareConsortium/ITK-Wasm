import loadEmscriptenModuleNode from '../core/internal/loadEmscriptenModuleNode.js'
import runPipelineEmscripten from './internal/runPipelineEmscripten.js'

import PipelineEmscriptenModule from './PipelineEmscriptenModule.js'
import PipelineOutput from './PipelineOutput.js'
import PipelineInput from './PipelineInput.js'
import RunPipelineResult from './RunPipelineResult.js'

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
