import PipelineOutput from './PipelineOutput.js'

interface RunPipelineResult {
  stdout: string
  stderr: string
  outputs: PipelineOutput[]
  webWorker: Worker
}

export default RunPipelineResult
