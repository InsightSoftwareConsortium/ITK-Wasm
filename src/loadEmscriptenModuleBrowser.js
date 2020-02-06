// Load the Emscripten module in the browser.
//
// If the browser supports WebAssembly, then use the path the the WebAssembly
// wrapper module instead.
//
// If itkModulesPath is a relative Path, then resolve assuming we were called
// from <itkModulesPath>/WebWorkers/, since modules are loaded by the web
// workers.
//
//
// itkModulesPath is usually taken from './itkConfig', but a different value
// could be passed.
//
// modulesDirectory is one of "ImageIOs", "MeshIOs", or "Pipelines"
//
// moduleBaseName is the file name of the emscripten module without the ".js"
// extension
const loadEmscriptenModule = (itkModulesPath, modulesDirectory, moduleBaseName) => {
  let prefix = itkModulesPath
  if (itkModulesPath[0] !== '/' && !itkModulesPath.startsWith('http')) {
    prefix = '..'
  }
  let modulePath = prefix + '/' + modulesDirectory + '/' + moduleBaseName + '.js'
  if (typeof WebAssembly === 'object' && typeof WebAssembly.Memory === 'function') {
    modulePath = prefix + '/' + modulesDirectory + '/' + moduleBaseName + 'Wasm.js'
  }
  return new Promise((resolve) => {
    importScripts(modulePath)
    Module['runtimeInitializedResolve'](resolve);
    console.log('imported, rutime initializer')
  })
}

export default loadEmscriptenModule
