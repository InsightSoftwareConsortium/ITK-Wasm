import * as downsample from '../../../dist/index.js'
globalThis.downsample = downsample

import { readImage } from '@itk-wasm/image-io'
globalThis.readImage = readImage

// Use local, vendored WebAssembly module assets
const viteBaseUrl = import.meta.env.BASE_URL
const pipelinesBaseUrl: string | URL = new URL(`${viteBaseUrl}pipelines`, document.location.origin).href
downsample.setPipelinesBaseUrl(pipelinesBaseUrl)


const params = new URLSearchParams(window.location.search)
if (!params.has('functionName')) {
  params.set('functionName', 'downsample')
  const url = new URL(document.location)
  url.search = params
  window.history.replaceState({ functionName: 'downsample' }, '', url)
}
import './downsample-bin-shrink-controller.js'
import './downsample-label-image-controller.js'
import './downsample-sigma-controller.js'
import './downsample-controller.js'
import './gaussian-kernel-radius-controller.js'

