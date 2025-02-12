import fs from 'fs'
import EmscriptenModule from '../itk-wasm-emscripten-module.js'
import { pathToFileURL } from 'url'
import { ZSTDDecoder } from '@thewtex/zstddec'

const zstdDecoder = new ZSTDDecoder()
await zstdDecoder.init()

async function loadEmscriptenModuleNode (
  modulePath: string
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
  const compressedWasmBinaryPath = `${modulePrefix}.wasm.zst`
  const compressedWasmBinary = fs.readFileSync(compressedWasmBinaryPath)
  const wasmBinary = zstdDecoder.decode(new Uint8Array(compressedWasmBinary))
  const fullModulePath = pathToFileURL(`${modulePrefix}.js`).href
  const result = await import(
    /* webpackIgnore: true */ /* @vite-ignore */ fullModulePath
  )
  const instantiated = result.default({ wasmBinary }) as EmscriptenModule
  return instantiated
}

export default loadEmscriptenModuleNode
