// Generated file. To retain edits, remove this comment.

import * as meshFilters from '../../../dist/index.js'
globalThis.meshFilters = meshFilters

// Use local, vendored WebAssembly module assets
const viteBaseUrl = import.meta.env.BASE_URL
const pipelinesBaseUrl: string | URL = new URL(`${viteBaseUrl}pipelines`, document.location.origin).href
meshFilters.setPipelinesBaseUrl(pipelinesBaseUrl)


const params = new URLSearchParams(window.location.search)
if (!params.has('functionName')) {
  params.set('functionName', 'geogramConversion')
  const url = new URL(document.location)
  url.search = params
  window.history.replaceState({ functionName: 'geogramConversion' }, '', url)
}
import './geogram-conversion-controller.js'
import './keep-largest-component-controller.js'
import './repair-controller.js'
import './slice-mesh-controller.js'
import './smooth-remesh-controller.js'

