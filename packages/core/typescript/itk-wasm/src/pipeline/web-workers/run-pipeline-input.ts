import PipelineInput from '../pipeline-input.js'
import PipelineOutput from '../pipeline-output.js'
import WebWorkerInput from './web-worker-input.js'

interface RunPipelineInput extends WebWorkerInput {
  pipelinePath: string | object
  pipelineBaseUrl: string
  args: string[]
  outputs: PipelineOutput[]
  inputs: PipelineInput[]
}

export default RunPipelineInput
