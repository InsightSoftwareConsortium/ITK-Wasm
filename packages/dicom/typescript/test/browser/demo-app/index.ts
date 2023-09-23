// Generated file. To retain edits, remove this comment.

import * as dicom from '../../../dist/bundles/dicom.js'

// Use local, vendored WebAssembly module assets
const pipelinesBaseUrl: string | URL = new URL('/pipelines', document.location.origin).href
dicom.setPipelinesBaseUrl(pipelinesBaseUrl)
const pipelineWorkerUrl: string | URL | null = new URL('/web-workers/pipeline.worker.js', document.location.origin).href
dicom.setPipelineWorkerUrl(pipelineWorkerUrl)

import './apply-presentation-state-to-image-controller.js'
import './read-dicom-encapsulated-pdf-controller.js'
import './structured-report-to-html-controller.js'
import './structured-report-to-text-controller.js'
import './read-dicom-tags-controller.js'
import './read-image-dicom-file-series-controller.js'

const params = new URLSearchParams(window.location.search)
if (!params.has('functionName')) {
  params.set('functionName', 'applyPresentationStateToImage')
  const url = new URL(document.location)
  url.search = params
  window.history.replaceState({ functionName: 'applyPresentationStateToImage' }, '', url)
}
