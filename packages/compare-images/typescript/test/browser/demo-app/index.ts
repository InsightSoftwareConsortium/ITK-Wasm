// Generated file. To retain edits, remove this comment.

import * as compareImages from '../../../dist/bundles/compare-images.js'

// Use local, vendored WebAssembly module assets
const pipelinesBaseUrl: string | URL = new URL('/pipelines', document.location.origin).href
compareImages.setPipelinesBaseUrl(pipelinesBaseUrl)
const pipelineWorkerUrl: string | URL | null = new URL('/web-workers/pipeline.worker.js', document.location.origin).href
compareImages.setPipelineWorkerUrl(pipelineWorkerUrl)

import './compare-double-images-controller.js'
import './vector-magnitude-controller.js'
