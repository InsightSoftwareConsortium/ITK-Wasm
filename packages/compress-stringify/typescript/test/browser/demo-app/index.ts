// Generated file. To retain edits, remove this comment.

import * as compressStringify from '../../../dist/bundles/compress-stringify.js'

// Use local, vendored WebAssembly module assets
const pipelinesBaseUrl: string | URL = new URL('/pipelines', document.location.origin).href
compressStringify.setPipelinesBaseUrl(pipelinesBaseUrl)
const pipelineWorkerUrl: string | URL | null = new URL('/web-workers/pipeline.worker.js', document.location.origin).href
compressStringify.setPipelineWorkerUrl(pipelineWorkerUrl)

import './compress-stringify-controller.js'
import './parse-string-decompress-controller.js'

const params = new URLSearchParams(window.location.search)
if (!params.has('functionName')) {
  params.set('functionName', 'compressStringify')
  const url = new URL(document.location)
  url.search = params
  window.history.replaceState({ functionName: 'compressStringify' }, '', url)
}
