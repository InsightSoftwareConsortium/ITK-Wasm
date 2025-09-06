import axios from 'axios'

import { ZSTDDecoder } from '@thewtex/zstddec'

import EmscriptenModule from '../itk-wasm-emscripten-module.js'
import RunPipelineOptions from '../run-pipeline-options.js'
import pthreadSupportAvailable from '../pthread-support-available.js'

const decoder = new ZSTDDecoder()
let decoderInitialized = false

async function loadEmscriptenModuleMainThread(
  moduleRelativePathOrURL: string | URL,
  baseUrl?: string,
  queryParams?: RunPipelineOptions['pipelineQueryParams'],
  disableThreads?: boolean
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

  // Check for pthread support and use the appropriate WASM file
  const hasPthreadSupport = pthreadSupportAvailable() && disableThreads !== true
  const wasmBinaryPath = `${modulePrefix}.wasm`

  if (hasPthreadSupport) {
    // Try to load the threaded version first
    const threadsWasmPath = `${modulePrefix}.threads.wasm`
    try {
      const threadsResponse = await axios.get(`${threadsWasmPath}.zst`, {
        responseType: 'arraybuffer',
        params: queryParams,
        timeout: 10000, // 10 second timeout for threaded WASM
        validateStatus: (status) => status === 200
      })

      // Validate the response data
      if (
        threadsResponse.data == null ||
        threadsResponse.data.byteLength === 0
      ) {
        throw new Error('Empty response data for threaded WASM')
      }

      if (!decoderInitialized) {
        await decoder.init()
        decoderInitialized = true
      }
      const decompressedArray = decoder.decode(
        new Uint8Array(threadsResponse.data)
      )

      // Validate the decompressed data
      if (decompressedArray == null || decompressedArray.byteLength === 0) {
        throw new Error('Failed to decompress threaded WASM data')
      }

      // Validate WASM magic bytes (0x00, 0x61, 0x73, 0x6d)
      if (
        decompressedArray.byteLength < 4 ||
        decompressedArray[0] !== 0x00 ||
        decompressedArray[1] !== 0x61 ||
        decompressedArray[2] !== 0x73 ||
        decompressedArray[3] !== 0x6d
      ) {
        throw new Error('Invalid WASM magic bytes in threaded WASM data')
      }

      const wasmBinary = decompressedArray.buffer
      const fullModulePath = `${modulePrefix}.js`
      const result = await import(
        /* webpackIgnore: true */ /* @vite-ignore */ fullModulePath
      )
      const instantiated = result.default({ wasmBinary }) as EmscriptenModule
      return instantiated
    } catch (error) {
      // Fall back to non-threaded version if threaded version is not available
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      console.warn(
        `Threaded WASM not available for ${modulePrefix}, falling back to non-threaded version:`,
        errorMessage
      )
    }
  }

  // Load non-threaded version
  const response = await axios.get(`${wasmBinaryPath}.zst`, {
    responseType: 'arraybuffer',
    params: queryParams
  })

  // Validate the response data
  if (response.data == null || response.data.byteLength === 0) {
    throw new Error('Empty response data for non-threaded WASM')
  }

  if (!decoderInitialized) {
    await decoder.init()
    decoderInitialized = true
  }
  const decompressedArray = decoder.decode(new Uint8Array(response.data))

  // Validate the decompressed data
  if (decompressedArray == null || decompressedArray.byteLength === 0) {
    throw new Error('Failed to decompress non-threaded WASM data')
  }

  // Validate WASM magic bytes (0x00, 0x61, 0x73, 0x6d)
  if (
    decompressedArray.byteLength < 4 ||
    decompressedArray[0] !== 0x00 ||
    decompressedArray[1] !== 0x61 ||
    decompressedArray[2] !== 0x73 ||
    decompressedArray[3] !== 0x6d
  ) {
    throw new Error('Invalid WASM magic bytes in non-threaded WASM data')
  }

  const wasmBinary = decompressedArray.buffer
  const fullModulePath = `${modulePrefix}.js`
  const result = await import(
    /* webpackIgnore: true */ /* @vite-ignore */ fullModulePath
  )
  const instantiated = result.default({ wasmBinary }) as EmscriptenModule
  return instantiated
}

export default loadEmscriptenModuleMainThread
