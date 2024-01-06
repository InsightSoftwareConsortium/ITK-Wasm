import * as @bindgenBundleNameCamelCase@ from '../../../dist/index.js'
globalThis.@bindgenBundleNameCamelCase@ = @bindgenBundleNameCamelCase@

// Use local, vendored WebAssembly module assets
const pipelinesBaseUrl: string | URL = new URL('/pipelines', document.location.origin).href
@bindgenBundleNameCamelCase@.setPipelinesBaseUrl(pipelinesBaseUrl)

@bindgenFunctionLogic@
