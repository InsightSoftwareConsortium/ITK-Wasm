import PipelineOutput from '../pipeline-output.js'
import PipelineInput from '../pipeline-input.js'
import RunPipelineWorkerResult from './run-pipeline-worker-result.js'
import RunPipelineOptions from '../run-pipeline-options.js'

interface WorkerOperations {
  runPipeline: (pipelinePath: string, pipelineBaseUrl: string, args: string[], outputs: PipelineOutput[] | null, inputs: PipelineInput[] | null, pipelineQueryParams?: RunPipelineOptions['pipelineQueryParams']) => RunPipelineWorkerResult
}

export default WorkerOperations
