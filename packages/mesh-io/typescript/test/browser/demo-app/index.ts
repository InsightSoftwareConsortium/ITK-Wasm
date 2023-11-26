// Generated file. To retain edits, remove this comment.

import * as meshIo from '../../../dist/index.js'

// Use local, vendored WebAssembly module assets
const pipelinesBaseUrl: string | URL = new URL('/pipelines', document.location.origin).href
meshIo.setPipelinesBaseUrl(pipelinesBaseUrl)


const params = new URLSearchParams(window.location.search)
if (!params.has('functionName')) {
  params.set('functionName', 'byuReadMesh')
  const url = new URL(document.location)
  url.search = params
  window.history.replaceState({ functionName: 'byuReadMesh' }, '', url)
}
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
import './wasm-ztd-read-mesh-controller.js'
import './wasm-ztd-write-mesh-controller.js'

