import * as Comlink from 'comlink'

import PipelineOutput from '../pipeline-output.js'
import PipelineInput from '../pipeline-input.js'
import RunPipelineWorkerResult from './run-pipeline-worker-result.js'
import loadPipelineModule from './load-pipeline-module.js'
import runPipeline from './run-pipeline.js'
import RunPipelineOptions from '../run-pipeline-options.js'

function processThreadsArgs (args: string[]): {
  disableThreads: boolean
  filteredArgs: string[]
} {
  const filteredArgs: string[] = []
  let disableThreads = false

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--threads' && i + 1 < args.length && args[i + 1] === '0') {
      disableThreads = true
      // Skip both '--threads' and '0'
      i++ // Skip the next element ('0')
    } else {
      filteredArgs.push(args[i])
    }
  }

  return { disableThreads, filteredArgs }
}

const workerOperations = {
  runPipeline: async function (
    pipelinePath: string,
    pipelineBaseUrl: string,
    args: string[],
    outputs: PipelineOutput[] | null,
    inputs: PipelineInput[] | null,
    pipelineQueryParams?: RunPipelineOptions['pipelineQueryParams']
  ): Promise<RunPipelineWorkerResult> {
    const { disableThreads, filteredArgs } = processThreadsArgs(args)
    const pipelineModule = await loadPipelineModule(
      pipelinePath,
      pipelineBaseUrl,
      pipelineQueryParams,
      disableThreads
    )
    return await runPipeline(pipelineModule, filteredArgs, outputs, inputs)
  }
}

Comlink.expose(workerOperations)
