import { setPipelineWorkerUrl } from './index.js'
// @ts-expect-error: TS1192
import pipelineWorker from './pipeline/web-workers/itk-wasm-pipeline.worker.js'
setPipelineWorkerUrl(pipelineWorker as string)

export * from './index.js'
