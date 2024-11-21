import path from 'path'

import mkdirP from '../mkdir-p.js'

import snakeCase from '../snake-case.js'

import dispatchPackageReadme from './dispatch-package-readme.js'
import dispatchFunctionModule from './dispatch-function-module.js'
import packagePyProjectToml from './package-py-project-toml.js'
import packageDocs from './package-docs.js'
import packageDunderInit from './package-dunder-init.js'
import dispatchTestModule from './dispatch-test-module.js'
import dispatchPipelineTest from './dispatch-pipeline-test.js'
import packageVersion from './package-version.js'

import wasmBinaryInterfaceJson from '../wasm-binary-interface-json.js'

function dispatchPackage(outputDir, buildDir, wasmBinaries, options) {
  const packageName = options.packageName
  const packageDir = path.join(outputDir, packageName)
  mkdirP(packageDir)

  const pypackage = snakeCase(packageName)
  const bindgenPyPackage = pypackage
  mkdirP(path.join(packageDir, pypackage))

  dispatchPackageReadme(packageName, options.packageDescription, packageDir)
  packagePyProjectToml(packageName, packageDir, bindgenPyPackage, options)
  packageVersion(packageDir, pypackage, options)
  const async = true
  const sync = true
  packageDunderInit(
    outputDir,
    buildDir,
    wasmBinaries,
    packageName,
    options.packageDescription,
    packageDir,
    pypackage,
    async,
    sync
  )
  packageDocs(packageName, packageDir, pypackage, options)
  dispatchTestModule(packageDir, pypackage)

  wasmBinaries.forEach((wasmBinaryName) => {
    const { interfaceJson } = wasmBinaryInterfaceJson(
      outputDir,
      buildDir,
      wasmBinaryName
    )
    const functionName = snakeCase(interfaceJson.name)
    dispatchFunctionModule(
      interfaceJson,
      pypackage,
      path.join(packageDir, pypackage, `${functionName}.py`)
    )
    dispatchPipelineTest(packageDir, pypackage, functionName)
  })
}

export default dispatchPackage
