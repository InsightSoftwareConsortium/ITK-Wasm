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
function loadEmscriptenModule(itkModulesPath, modulesDirectory, moduleBaseName) {
  let prefix = itkModulesPath
  if (itkModulesPath[0] !== '/' && !itkModulesPath.startsWith('http')) {
    prefix = '..'
  }
  let modulePath = prefix + '/' + modulesDirectory + '/' + moduleBaseName + '.js'
  if (typeof WebAssembly === 'object' && typeof WebAssembly.Memory === 'function') {
    modulePath = prefix + '/' + modulesDirectory + '/' + moduleBaseName + 'Wasm.js'
  }
  importScripts(modulePath)
  // return Promise.resolve(self[moduleBaseName]());
  //return new Promise((resolve) => {
    //console.log('loading')
    //const promiseResolve = resolve
    //console.log(resolve);
    //console.log(promiseResolve);
    //self[moduleBaseName]().then((module) => {
      //console.log('returning module');
      //console.log(module);
      //console.log(promiseResolve);
      //console.log(resolve);
      //resolve(module);
      ////debugger;
      ////module['onRuntimeInitialized']();
      //console.log('promise SHOULD have resolved')
      //// return module;
      //return module;
    //});
    //return;
    ////console.log(moduleBaseName)
    ////const promiseResolve = resolve
    ////mymodule.then((module) => {
      ////console.log('then ....')
      ////console.log(resolve)
      ////console.log(promiseResolve)
      ////console.log(module)
      ////return promiseResolve(module)
    ////})
    ////module.runtimeInitializedResolve(resolve, module);
  //})
  //self[moduleBaseName]().then((module) => {
    //console.log('returning module');
    //console.log(module);
    //return module;
  //});
  //const runtimeInitializedModulePromise = Promise.resolve(self[moduleBaseName]());
  //console.log('Keep the promise?')
  //console.log(runtimeInitializedModulePromise);
  //const runtimeInitializedModule = await runtimeInitializedModulePromise;
  //// const runtimeInitializedModule = await Promise.resolve(self[moduleBaseName]())
  //console.log(runtimeInitalizedModule)
  //debugger
  //return runtimeInitializedModule;
  // return Promise.resolve(mymodule)
  //return new Promise((resolve) => {
    //console.log('loading')
    //console.log(moduleBaseName)
    //const module = self[moduleBaseName]();
    //console.log(module)
    //console.log(module.runtimeInitializedResolve);
    //module['runtimeInitializedResolve'](resolve);
    //// Initializes the runtime.
    //// module['run']();
    ////const promiseResolve = resolve
    ////mymodule.then((module) => {
      ////console.log('then ....')
      ////console.log(resolve)
      ////console.log(promiseResolve)
      ////console.log(module)
      ////return promiseResolve(module)
    ////})
    ////module.runtimeInitializedResolve(resolve, module);
  //})
  const module = self[moduleBaseName]();
  console.log('returning module: ', module);
  return module;
}

export default loadEmscriptenModule
