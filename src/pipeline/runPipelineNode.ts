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
  mountContainingDirs?: Set<string>
): Promise<RunPipelineResult> {
  const Module = (await loadEmscriptenModuleNode(
    pipelinePath
  )) as PipelineEmscriptenModule
  const mountedDirs: Set<string> = new Set()
  if (typeof mountContainingDirs !== 'undefined') {
    mountContainingDirs.forEach((filePath) => {
      mountedDirs.add(Module.mountContainingDir(filePath))
    })
  }
  const result = runPipelineEmscripten(Module, args, outputs, inputs)
  if (typeof mountContainingDirs !== 'undefined') {
    mountedDirs.forEach((filePath) => {
      Module.unmountContainingDir(filePath)
    })
  }
  return result
}

export default runPipelineNode
