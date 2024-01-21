// Generated file. To retain edits, remove this comment.

import * as downsample from '../../../dist/index.js'
globalThis.downsample = downsample

// Use local, vendored WebAssembly module assets
const pipelinesBaseUrl: string | URL = new URL('/pipelines', document.location.origin).href
downsample.setPipelinesBaseUrl(pipelinesBaseUrl)


const params = new URLSearchParams(window.location.search)
if (!params.has('functionName')) {
  params.set('functionName', 'downsampleBinStrink')
  const url = new URL(document.location)
  url.search = params
  window.history.replaceState({ functionName: 'downsampleBinStrink' }, '', url)
}
import './downsample-bin-strink-controller.js'
import './downsample-controller.js'
import './downsample-controller.js'
import './downsample-controller.js'
import './gaussian-kernel-radius-controller.js'

