import axios from 'axios'

import { ZSTDDecoder } from '@thewtex/zstddec'

import EmscriptenModule from '../itk-wasm-emscripten-module.js'
import RunPipelineOptions from '../run-pipeline-options.js'

const decoder = new ZSTDDecoder()
let decoderInitialized = false

async function loadEmscriptenModuleMainThread (
  moduleRelativePathOrURL: string | URL,
  baseUrl?: string,
  queryParams?: RunPipelineOptions['pipelineQueryParams']
): Promise<EmscriptenModule> {
  let modulePrefix: string = 'unknown'
  if (typeof moduleRelativePathOrURL !== 'string') {
    modulePrefix = moduleRelativePathOrURL.href
  } else if (moduleRelativePathOrURL.startsWith('http')) {
    modulePrefix = moduleRelativePathOrURL
  } else {
    modulePrefix =
      typeof baseUrl !== 'undefined'
        ? `${baseUrl}/${moduleRelativePathOrURL}`
        : moduleRelativePathOrURL
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
  const fullModulePath = `${modulePrefix}.js`
  const result = await import(
    /* webpackIgnore: true */ /* @vite-ignore */ fullModulePath
  )
  const instantiated = result.default({ wasmBinary }) as EmscriptenModule
  return instantiated
}

export default loadEmscriptenModuleMainThread
