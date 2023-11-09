import * as compareImages from '../../../dist/index.js'

// Use local, vendored WebAssembly module assets
const pipelinesBaseUrl: string | URL = new URL('/pipelines', document.location.origin).href
compareImages.setPipelinesBaseUrl(pipelinesBaseUrl)

import './compare-images-controller.js'
