// Load the Emscripten module in the browser.
//
// If the browser supports WebAssembly, then use the path the the WebAssembly
// wrapper module instead.
//
// If itkModulesPath is a relative Path, then resolve assuming we were called
// from <itkModulesPath>/WebWorkers/, since modules are loaded by the web
// workers.
//
// itkModulesPath is usually taken from './itkConfig', but a different value
// could be passed.
//
// If isAbsoluteURL is `true`, then itkModulesPath is not used, and
// pipelinePath is assumed to be an absoluteURL.
//
// modulesDirectory is one of "image-io", "mesh-io", or "pipelines"
//
// pipelinePath is the file name of the emscripten module without the ".js"
// extension
function loadEmscriptenModule(itkModulesPath: string, modulesDirectory: string, pipelinePath: string, isAbsoluteURL: boolean): object {
  let prefix = itkModulesPath
  if (itkModulesPath[0] !== '/' && !itkModulesPath.startsWith('http')) {
    prefix = '..'
  }
  const moduleScriptDir = prefix + '/' + modulesDirectory
  if (typeof WebAssembly === 'object' && typeof WebAssembly.Memory === 'function') {
    let modulePath = moduleScriptDir + '/' + pipelinePath + 'Wasm.js'
    if (isAbsoluteURL) {
      modulePath = pipelinePath + 'Wasm.js'
    }
    importScripts(modulePath)
    const moduleBaseName: string = pipelinePath.replace(/.*\//, '')
    // @ts-ignore: error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'WorkerGlobalScope & typeof globalThis'.
    const wrapperModule = self[moduleBaseName] as (moduleParams: object) => object
    const emscriptenModule: object = wrapperModule({ moduleScriptDir, isAbsoluteURL, pipelinePath });
    return emscriptenModule;
  } else {
    let modulePath = moduleScriptDir + '/' + pipelinePath + '.js'
    if (isAbsoluteURL) {
      modulePath = pipelinePath + '.js'
    }
    importScripts(modulePath)
    // @ts-ignore: error TS2552: Cannot find name 'Module'
    return Module
  }
}

export default loadEmscriptenModule
