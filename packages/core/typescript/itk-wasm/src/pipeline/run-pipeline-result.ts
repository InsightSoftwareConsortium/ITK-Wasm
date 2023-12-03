import PipelineOutput from './pipeline-output.js'

interface RunPipelineResult {
  returnValue: number
  stdout: string
  stderr: string
  outputs: PipelineOutput[]
  webWorker?: Worker
}

export default RunPipelineResult
