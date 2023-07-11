import * as @bindgenBundleNameCamelCase@ from '../../../dist/bundles/@bindgenBundleName@.js'

// Use local, vendored WebAssembly module assets
const pipelinesBaseUrl: string | URL = new URL('/pipelines', document.location.origin).href
@bindgenBundleNameCamelCase@.setPipelinesBaseUrl(pipelinesBaseUrl)
const pipelineWorkerUrl: string | URL | null = new URL('/web-workers/pipeline.worker.js', document.location.origin).href
@bindgenBundleNameCamelCase@.setPipelineWorkerUrl(pipelineWorkerUrl)

@bindgenFunctionLogic@