async function loadEmscriptenModuleNode(modulePath: string): Promise<object> {
  const result = await import(modulePath)
  return result
}

export default loadEmscriptenModuleNode
