import axios from 'axios'

import EmscriptenModule from '../EmscriptenModule.js'

// Load the Emscripten module in the browser in a WebWorker.
//
// moduleRelativePathOrURL specifies the module to load either
// `${itkModulesPath}/${moduleType}/${moduleRelativePathOrURL}` or, if it is a
// URL, `moduleRelativePathOrURL.href`.
//
// moduleType is one of "image-io", "mesh-io", "polydata-io", or "pipeline"
//
// itkModulesPath is usually taken from '../itkConfig.js', but a different value
// could be passed.
async function loadEmscriptenModuleWebWorker(moduleRelativePathOrURL: string | URL, moduleType: "image-io" | "mesh-io" | "polydata-io" | "pipeline", itkModulesPath: string): Promise<EmscriptenModule> {
  let modulePrefix = null
  if (typeof moduleRelativePathOrURL !== 'string') {
    modulePrefix = moduleRelativePathOrURL.href
  } else {
    modulePrefix = `${itkModulesPath}/${moduleType}/${moduleRelativePathOrURL}`
  }
  if (modulePrefix.endsWith('.js')) {
    modulePrefix = modulePrefix.substring(0, modulePrefix.length - 3)
  }
  if (modulePrefix.endsWith('.wasm')) {
    modulePrefix = modulePrefix.substring(0, modulePrefix.length - 5)
  }
  // importScripts / UMD is required over dynamic ESM import until Firefox
  // adds worker dynamic import support:
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1540913
  const wasmBinaryPath = `${modulePrefix}.umd.wasm`
  const response = await axios.get(wasmBinaryPath, { responseType: 'arraybuffer' })
  const wasmBinary = response.data
  const modulePath = `${modulePrefix}.umd.js`
  importScripts(modulePath)
  const moduleBaseName: string = modulePrefix.replace(/.*\//, '')
  // @ts-ignore: error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'WorkerGlobalScope & typeof globalThis'.
  const wrapperModule = self[moduleBaseName] as (moduleParams: object) => object
  const emscriptenModule = wrapperModule({ wasmBinary }) as EmscriptenModule
  return emscriptenModule
}

export default loadEmscriptenModuleWebWorker
