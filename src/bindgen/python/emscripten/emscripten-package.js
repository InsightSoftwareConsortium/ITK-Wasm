import path from 'path'

import mkdirP from '../../mkdir-p.js'
import snakeCase from '../../snake-case.js'

import emscriptenPackageReadme from './emscripten-package-readme.js'
import packagePyProjectToml from '../package-py-project-toml.js'
import packageVersion from '../package-version.js'
import packageDunderInit from '../package-dunder-init.js'
import emscriptenPyodideModule from './emscripten-pyodide-module.js'
import emscriptenTestModule from './emscripten-test-module.js'
import emscriptenFunctionModule from './emscripten-function-module.js'
import wasmBinaryInterfaceJson from '../../wasm-binary-interface-json.js'

function emscriptenPackage(outputDir, buildDir, wasmBinaries, options) {
  const packageName = `${options.packageName}-emscripten`
  const packageDir = path.join(outputDir, packageName)
  const packageDescription = `${options.packageDescription} Emscripten implementation.`
  mkdirP(packageDir)

 const pypackage = snakeCase(packageName)
  const bindgenPyPackage = pypackage
  mkdirP(path.join(packageDir, pypackage))

  emscriptenPackageReadme(packageName, packageDescription, packageDir)
  packagePyProjectToml(packageName, packageDir, bindgenPyPackage, options)
  packageVersion(packageDir, pypackage, options)
  const async = true
  const sync = false
  packageDunderInit(outputDir, buildDir, wasmBinaries, packageName, packageDescription, packageDir, pypackage, async, sync)
  emscriptenPyodideModule(outputDir, packageDir, pypackage, options)
  emscriptenTestModule(packageDir, pypackage)

  const wasmModulesDir = path.join(packageDir, pypackage, 'wasm_modules')
  mkdirP(wasmModulesDir)
  wasmBinaries.forEach((wasmBinaryName) => {
    const { interfaceJson, parsedPath } = wasmBinaryInterfaceJson(outputDir, buildDir, wasmBinaryName)
    const functionName = snakeCase(interfaceJson.name) + '_async'
    emscriptenFunctionModule(interfaceJson, pypackage, path.join(packageDir, pypackage, `${functionName}.py`))
  })
}

export default emscriptenPackage
