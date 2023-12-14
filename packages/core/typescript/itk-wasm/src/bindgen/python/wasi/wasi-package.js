import fs from 'fs-extra'
import path from 'path'

import mkdirP from '../../mkdir-p.js'

import snakeCase from '../../snake-case.js'

import wasiPackageReadme from './wasi-package-readme.js'
import packagePyProjectToml from '../package-py-project-toml.js'
import packageVersion from '../package-version.js'
import wasiFunctionModule from './wasi-function-module.js'
import wasmBinaryInterfaceJson from '../../wasm-binary-interface-json.js'
import packageDunderInit from '../package-dunder-init.js'

function wasiPackage(outputDir, buildDir, wasmBinaries, options) {
  const packageName = `${options.packageName}-wasi`
  const packageDir = path.join(outputDir, packageName)
  const packageDescription = `${options.packageDescription} WASI implementation.`
  mkdirP(packageDir)

  const pypackage = snakeCase(packageName)
  const bindgenPyPackage = pypackage
  mkdirP(path.join(packageDir, pypackage))

  wasiPackageReadme(packageName, packageDescription, packageDir)
  packagePyProjectToml(packageName, packageDir, bindgenPyPackage, options)
  packageVersion(packageDir, pypackage, options)
  const async = false
  const sync = true
  packageDunderInit(outputDir, buildDir, wasmBinaries, packageName, packageDescription, packageDir, pypackage, async, sync)

  const wasmModulesDir = path.join(packageDir, pypackage, 'wasm_modules')
  mkdirP(wasmModulesDir)
  wasmBinaries.forEach((wasmBinaryName) => {
    const { interfaceJson, parsedPath } = wasmBinaryInterfaceJson(outputDir, buildDir, wasmBinaryName)
    fs.copyFileSync(path.join(parsedPath.dir, parsedPath.base), path.join(wasmModulesDir, parsedPath.base))
    const functionName = snakeCase(interfaceJson.name)
    wasiFunctionModule(interfaceJson, pypackage, path.join(packageDir, pypackage, `${functionName}.py`))
  })
}

export default wasiPackage
