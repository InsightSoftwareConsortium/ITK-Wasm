import * as meshIo from '../../../dist/index.js'

globalThis.meshIo = meshIo

// Use local, vendored WebAssembly module assets
const viteBaseUrl = import.meta.env.BASE_URL
const pipelinesBaseUrl: string | URL = new URL(`${viteBaseUrl}pipelines`, document.location.origin).href
meshIo.setPipelinesBaseUrl(pipelinesBaseUrl)


const params = new URLSearchParams(window.location.search)
if (!params.has('functionName')) {
// Begin added content
  params.set('functionName', 'readMesh')
  const url = new URL(document.location)
  url.search = params
  window.history.replaceState({ functionName: 'readMesh' }, '', url)
}

import './read-mesh-controller.js'
import './write-mesh-controller.js'
// End added content
import './byu-read-mesh-controller.js'
import './byu-write-mesh-controller.js'
import './free-surfer-ascii-read-mesh-controller.js'
import './free-surfer-ascii-write-mesh-controller.js'
import './free-surfer-binary-read-mesh-controller.js'
import './free-surfer-binary-write-mesh-controller.js'
import './obj-read-mesh-controller.js'
import './obj-write-mesh-controller.js'
import './off-read-mesh-controller.js'
import './off-write-mesh-controller.js'
import './stl-read-mesh-controller.js'
import './stl-write-mesh-controller.js'
import './swc-read-mesh-controller.js'
import './swc-write-mesh-controller.js'
import './vtk-poly-data-read-mesh-controller.js'
import './vtk-poly-data-write-mesh-controller.js'
import './wasm-read-mesh-controller.js'
import './wasm-write-mesh-controller.js'
import './wasm-zstd-read-mesh-controller.js'
import './wasm-zstd-write-mesh-controller.js'

