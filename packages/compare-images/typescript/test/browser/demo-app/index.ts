import * as compareImages from '../../../dist/index.js'

// Use local, vendored WebAssembly module assets
const viteBaseUrl = import.meta.env.BASE_URL
const pipelinesBaseUrl: string | URL = new URL(`${viteBaseUrl}pipelines`, document.location.origin).href
compareImages.setPipelinesBaseUrl(pipelinesBaseUrl)

import './compare-images-controller.js'
