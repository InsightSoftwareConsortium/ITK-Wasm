import * as @bindgenBundleNameCamelCase@ from '../../../dist/index.js'
globalThis.@bindgenBundleNameCamelCase@ = @bindgenBundleNameCamelCase@

// Use local, vendored WebAssembly module assets
const viteBaseUrl = import.meta.env.BASE_URL
const pipelinesBaseUrl: string | URL = new URL(`${viteBaseUrl}pipelines`, document.location.origin).href
@bindgenBundleNameCamelCase@.setPipelinesBaseUrl(pipelinesBaseUrl)

@bindgenFunctionLogic@
