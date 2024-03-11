import * as Comlink from 'comlink'

import PipelineOutput from '../pipeline-output.js'
import PipelineInput from '../pipeline-input.js'
import RunPipelineWorkerResult from './run-pipeline-worker-result.js'
import loadPipelineModule from './load-pipeline-module.js'
import runPipeline from './run-pipeline.js'
import RunPipelineOptions from '../run-pipeline-options.js'

const workerOperations = {
  runPipeline: async function (pipelinePath: string, pipelineBaseUrl: string, args: string[], outputs: PipelineOutput[] | null, inputs: PipelineInput[] | null, pipelineQueryParams?: RunPipelineOptions['pipelineQueryParams']): Promise<RunPipelineWorkerResult> {
    const pipelineModule = await loadPipelineModule(pipelinePath, pipelineBaseUrl, pipelineQueryParams)
    return await runPipeline(pipelineModule, args, outputs, inputs)
  }
}

Comlink.expose(workerOperations)
