import PipelineOutput from '../pipeline-output.js'
interface RunPipelineWorkerResult {
  returnValue: number
  stdout: string
  stderr: string
  outputs: PipelineOutput[]
}

export default RunPipelineWorkerResult
