import axios from 'axios'

import { ZSTDDecoder } from '@thewtex/zstddec'
const decoder = new ZSTDDecoder()
let decoderInitialized = false

import ITKWasmEmscriptenModule from '../ITKWasmEmscriptenModule.js'

// Load the Emscripten module in the browser in a WebWorker.
//
// baseUrl is usually taken from 'getPipelinesBaseUrl()', but a different value
// could be passed.
async function loadEmscriptenModuleWebWorker(moduleRelativePathOrURL: string | URL, baseUrl: string): Promise<ITKWasmEmscriptenModule> {
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
  const wasmBinaryPath = `${modulePrefix}.wasm`
  const response = await axios.get(`${wasmBinaryPath}.zst`, { responseType: 'arraybuffer' })
  if (!decoderInitialized) {
    await decoder.init()
    decoderInitialized = true
  }
  const decompressedArray = decoder.decode(new Uint8Array(response.data))
  const wasmBinary = decompressedArray.buffer
  const modulePath = `${modulePrefix}.js`
  const result = await import(/* webpackIgnore: true */ /* @vite-ignore */ modulePath)
  const emscriptenModule = result.default({ wasmBinary }) as ITKWasmEmscriptenModule
  return emscriptenModule
}

export default loadEmscriptenModuleWebWorker
