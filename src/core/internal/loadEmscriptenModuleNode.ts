import fs from 'fs'
import EmscriptenModule from '../ITKWasmEmscriptenModule.js'

async function loadEmscriptenModuleNode (modulePath: string): Promise<EmscriptenModule> {
  let modulePrefix = modulePath
  if (modulePath.endsWith('.js')) {
    modulePrefix = modulePath.substring(0, modulePath.length - 3)
  }
  if (modulePath.endsWith('.wasm')) {
    modulePrefix = modulePath.substring(0, modulePath.length - 5)
  }
  const wasmBinaryPath = `${modulePrefix}.wasm`
  const wasmBinary = fs.readFileSync(wasmBinaryPath)
  const fullModulePath = `${modulePrefix}.js`
  const result = await import(/* webpackIgnore: true */ /* @vite-ignore */ fullModulePath)
  const instantiated = result.default({ wasmBinary }) as EmscriptenModule
  return instantiated
}

export default loadEmscriptenModuleNode
