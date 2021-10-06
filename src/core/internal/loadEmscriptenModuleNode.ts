// Workaround for EXPORT_ES6
// https://github.com/emscripten-core/emscripten/issues/11792
import { dirname } from "path"
globalThis.__dirname = dirname(import.meta.url)
import { createRequire } from 'module'
globalThis.require = createRequire(import.meta.url)

async function loadEmscriptenModuleNode(modulePath: string, wasmBinary: ArrayBuffer | Buffer): Promise<object> {
  const result = await import(modulePath)
  const instantiated = result.default({ wasmBinary })
  return instantiated
}

export default loadEmscriptenModuleNode
