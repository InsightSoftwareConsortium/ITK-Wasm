import axios from 'axios'

import { ZSTDDecoder } from '@thewtex/zstddec'

import ITKWasmEmscriptenModule from '../itk-wasm-emscripten-module.js'
import RunPipelineOptions from '../run-pipeline-options.js'

const decoder = new ZSTDDecoder()
let decoderInitialized = false

// Load the Emscripten module in the browser in a WebWorker.
//
// baseUrl is usually taken from 'getPipelinesBaseUrl()', but a different value
// could be passed.
async function loadEmscriptenModuleWebWorker (
  moduleRelativePathOrURL: string | URL,
  baseUrl: string,
  queryParams?: RunPipelineOptions['pipelineQueryParams']
): Promise<ITKWasmEmscriptenModule> {
  let modulePrefix = null
  if (typeof moduleRelativePathOrURL !== 'string') {
    modulePrefix = moduleRelativePathOrURL.href
  } else if (moduleRelativePathOrURL.startsWith('http')) {
    modulePrefix = moduleRelativePathOrURL
  } else {
    modulePrefix = `${baseUrl}/${moduleRelativePathOrURL}`
  }
  if (modulePrefix.endsWith('.js')) {
    modulePrefix = modulePrefix.substring(0, modulePrefix.length - 3)
  }
  if (modulePrefix.endsWith('.wasm')) {
    modulePrefix = modulePrefix.substring(0, modulePrefix.length - 5)
  }
  if (modulePrefix.endsWith('.wasm.zst')) {
    modulePrefix = modulePrefix.substring(0, modulePrefix.length - 9)
  }
  const wasmBinaryPath = `${modulePrefix}.wasm`
  const response = await axios.get(`${wasmBinaryPath}.zst`, {
    responseType: 'arraybuffer',
    params: queryParams
  })
  if (!decoderInitialized) {
    await decoder.init()
    decoderInitialized = true
  }
  const decompressedArray = decoder.decode(new Uint8Array(response.data))
  const wasmBinary = decompressedArray.buffer
  const modulePath = `${modulePrefix}.js`
  const result = await import(
    /* webpackIgnore: true */ /* @vite-ignore */ modulePath
  )
  const emscriptenModule = result.default({
    wasmBinary
  }) as ITKWasmEmscriptenModule
  return emscriptenModule
}

export default loadEmscriptenModuleWebWorker
