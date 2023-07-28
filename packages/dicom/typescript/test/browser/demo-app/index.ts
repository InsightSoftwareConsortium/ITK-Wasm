// Generated file. To retain edits, remove this comment.

import * as dicom from '../../../dist/bundles/dicom.js'

// Use local, vendored WebAssembly module assets
const pipelinesBaseUrl: string | URL = new URL('/pipelines', document.location.origin).href
dicom.setPipelinesBaseUrl(pipelinesBaseUrl)
const pipelineWorkerUrl: string | URL | null = new URL('/web-workers/pipeline.worker.js', document.location.origin).href
dicom.setPipelineWorkerUrl(pipelineWorkerUrl)

import './read-dicom-encapsulated-pdf-controller.js'
import './structured-report-to-text-controller.js'
