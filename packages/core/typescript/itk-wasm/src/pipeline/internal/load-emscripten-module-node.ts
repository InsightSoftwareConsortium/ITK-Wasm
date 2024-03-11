import fs from 'fs'
import EmscriptenModule from '../itk-wasm-emscripten-module.js'
import { pathToFileURL } from 'url'

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
  const wasmBinaryPath = `${modulePrefix}.wasm`
  const wasmBinary = fs.readFileSync(wasmBinaryPath)
  const fullModulePath = pathToFileURL(`${modulePrefix}.js`).href
  const result = await import(
    /* webpackIgnore: true */ /* @vite-ignore */ fullModulePath
  )
  const instantiated = result.default({ wasmBinary }) as EmscriptenModule
  return instantiated
}

export default loadEmscriptenModuleNode
