// Workaround for EXPORT_ES6
// https://github.com/emscripten-core/emscripten/issues/11792
import { dirname } from "path"
globalThis.__dirname = dirname(import.meta.url)
import { createRequire } from 'module'
globalThis.require = createRequire(import.meta.url)

async function loadEmscriptenModuleNode(modulePath: string, moduleScriptDir?: string): Promise<object> {
  const result = await import(modulePath)
  //const result = require(modulePath)
  console.log('result', result)
  //return result
  const instantiated = result.default({ moduleScriptDir })
  return instantiated
}

export default loadEmscriptenModuleNode
