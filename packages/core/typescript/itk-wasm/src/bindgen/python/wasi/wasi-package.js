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
import bindgenResource from '../bindgen-resource.js'
import writeIfOverrideNotPresent from '../../write-if-override-not-present.js'

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
  packageDunderInit(
    outputDir,
    buildDir,
    wasmBinaries,
    packageName,
    packageDescription,
    packageDir,
    pypackage,
    async,
    sync
  )

  const testDir = path.join(packageDir, 'tests')
  mkdirP(testDir)
  const testInit = path.join(testDir, '__init__.py')
  fs.writeFileSync(testInit, '')
  const commonSourcePath = bindgenResource(path.join('tests', 'common.py'))
  const commonModulePath = path.join(testDir, 'common.py')
  if (!fs.existsSync(commonModulePath)) {
    fs.copyFileSync(commonSourcePath, commonModulePath)
  }

  const wasmModulesDir = path.join(packageDir, pypackage, 'wasm_modules')
  mkdirP(wasmModulesDir)
  wasmBinaries.forEach((wasmBinaryName) => {
    const { interfaceJson, parsedPath } = wasmBinaryInterfaceJson(
      outputDir,
      buildDir,
      wasmBinaryName
    )
    fs.copyFileSync(
      path.join(parsedPath.dir, parsedPath.base),
      path.join(wasmModulesDir, parsedPath.base)
    )
    const functionName = snakeCase(interfaceJson.name)
    wasiFunctionModule(
      interfaceJson,
      pypackage,
      path.join(packageDir, pypackage, `${functionName}.py`)
    )

    const testPath = path.join(testDir, `test_${functionName}.py`)
    const testContent = `from ${pypackage} import ${functionName}\n\nfrom .common import test_input_path, test_output_path\n\ndef test_${functionName}():\n    pass\n`
    writeIfOverrideNotPresent(testPath, testContent, '#')
  })
}

export default wasiPackage
