import fs from 'fs'
import EmscriptenModule from '../itk-wasm-emscripten-module.js'
import { pathToFileURL } from 'url'
import { ZSTDDecoder } from '@thewtex/zstddec'
import pthreadSupportAvailable from '../pthread-support-available.js'

const zstdDecoder = new ZSTDDecoder()
await zstdDecoder.init()

async function loadEmscriptenModuleNode (
  modulePath: string,
  disableThreads?: boolean
): Promise<EmscriptenModule> {
  let modulePrefix = modulePath
  if (modulePath.endsWith('.js')) {
    modulePrefix = modulePath.substring(0, modulePath.length - 3)
  }
  if (modulePath.endsWith('.wasm')) {
    modulePrefix = modulePath.substring(0, modulePath.length - 5)
  }
  if (modulePath.endsWith('.wasm.zst')) {
    modulePrefix = modulePath.substring(0, modulePath.length - 9)
  }

  // Check for pthread support and use the appropriate WASM file
  const hasPthreadSupport = pthreadSupportAvailable() && (disableThreads !== true)
  let wasmFileName = `${modulePrefix}.wasm.zst`
  let wasmBinary: Uint8Array

  if (hasPthreadSupport) {
    const threadsWasmPath = `${modulePrefix}.threads.wasm.zst`
    if (fs.existsSync(threadsWasmPath)) {
      wasmFileName = threadsWasmPath
      const compressedWasmBinary = fs.readFileSync(wasmFileName)
      wasmBinary = zstdDecoder.decode(new Uint8Array(compressedWasmBinary))
    } else {
      // Fall back to checking for compressed non-threaded version
      if (fs.existsSync(wasmFileName)) {
        const compressedWasmBinary = fs.readFileSync(wasmFileName)
        wasmBinary = zstdDecoder.decode(new Uint8Array(compressedWasmBinary))
      } else {
        // Fall back to uncompressed WASM file
        const uncompressedWasmPath = `${modulePrefix}.wasm`
        if (fs.existsSync(uncompressedWasmPath)) {
          wasmBinary = fs.readFileSync(uncompressedWasmPath)
        } else {
          throw new Error(`No WASM file found for module: ${modulePrefix}`)
        }
      }
    }
  } else {
    // Check for compressed non-threaded version first
    if (fs.existsSync(wasmFileName)) {
      const compressedWasmBinary = fs.readFileSync(wasmFileName)
      wasmBinary = zstdDecoder.decode(new Uint8Array(compressedWasmBinary))
    } else {
      // Fall back to uncompressed WASM file
      const uncompressedWasmPath = `${modulePrefix}.wasm`
      if (fs.existsSync(uncompressedWasmPath)) {
        wasmBinary = fs.readFileSync(uncompressedWasmPath)
      } else {
        throw new Error(`No WASM file found for module: ${modulePrefix}`)
      }
    }
  }

  const fullModulePath = pathToFileURL(`${modulePrefix}.js`).href
  const result = await import(
    /* webpackIgnore: true */ /* @vite-ignore */ fullModulePath
  )
  const instantiated = result.default({ wasmBinary }) as EmscriptenModule
  return instantiated
}

export default loadEmscriptenModuleNode
