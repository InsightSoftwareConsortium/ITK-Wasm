function loadEmscriptenModuleNode(modulePath: string): object {
  const result = require(modulePath)
  return result
}

export default loadEmscriptenModuleNode
