import { setPipelineWorkerUrl } from './index.js'
// @ts-expect-error: TS1192
import pipelineWorker from '../dist/pipeline/web-workers/bundles/itk-wasm-pipeline.min.worker.js'
setPipelineWorkerUrl(pipelineWorker as string)

export * from './index.js'
