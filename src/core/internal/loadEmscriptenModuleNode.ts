import fs from 'fs'
// Workaround for EXPORT_ES6
// https://github.com/emscripten-core/emscripten/issues/11792
import { dirname } from "path"
globalThis.__dirname = dirname(import.meta.url)
import { createRequire } from 'module'
globalThis.require = createRequire(import.meta.url)

import EmscriptenModule from '../EmscriptenModule.js'

async function loadEmscriptenModuleNode(modulePath: string): Promise<EmscriptenModule> {
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
  const result = await import(/* webpackIgnore: true */ fullModulePath)
  const instantiated = result.default({ wasmBinary }) as EmscriptenModule
  return instantiated
}

export default loadEmscriptenModuleNode
