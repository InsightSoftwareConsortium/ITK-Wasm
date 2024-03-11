import axios from 'axios'

import EmscriptenModule from '../itk-wasm-emscripten-module.js'
import RunPipelineOptions from '../run-pipeline-options.js'

async function loadEmscriptenModuleMainThread (moduleRelativePathOrURL: string | URL, baseUrl?: string, queryParams?: RunPipelineOptions['pipelineQueryParams']): Promise<EmscriptenModule> {
  let modulePrefix: string = 'unknown'
  if (typeof moduleRelativePathOrURL !== 'string') {
    modulePrefix = moduleRelativePathOrURL.href
  } else if (moduleRelativePathOrURL.startsWith('http')) {
    modulePrefix = moduleRelativePathOrURL
  } else {
    modulePrefix = typeof baseUrl !== 'undefined' ? `${baseUrl}/${moduleRelativePathOrURL}` : moduleRelativePathOrURL
  }
  if (modulePrefix.endsWith('.js')) {
    modulePrefix = modulePrefix.substring(0, modulePrefix.length - 3)
  }
  if (modulePrefix.endsWith('.wasm')) {
    modulePrefix = modulePrefix.substring(0, modulePrefix.length - 5)
  }
  const wasmBinaryPath = `${modulePrefix}.wasm`
  const response = await axios.get(wasmBinaryPath, { responseType: 'arraybuffer', params: queryParams })
  const wasmBinary = response.data
  const fullModulePath = `${modulePrefix}.js`
  const result = await import(/* webpackIgnore: true */ /* @vite-ignore */ fullModulePath)
  const instantiated = result.default({ wasmBinary }) as EmscriptenModule
  return instantiated
}

export default loadEmscriptenModuleMainThread
