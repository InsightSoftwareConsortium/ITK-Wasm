import path from 'path'

import snakeCase from "../snake-case.js"

import wasmBinaryInterfaceJson from "../wasm-binary-interface-json.js"
import writeIfOverrideNotPresent from '../write-if-override-not-present.js'

function packageDunderInit(outputDir, buildDir, wasmBinaries, packageName, packageDescription, packageDir, pypackage, async, sync) {
  const functionNames = []
  wasmBinaries.forEach((wasmBinaryName) => {
    const { interfaceJson, parsedPath } = wasmBinaryInterfaceJson(outputDir, buildDir, wasmBinaryName)
    if (async) {
      functionNames.push(snakeCase(interfaceJson.name) + "_async")
    }
    if (sync) {
      functionNames.push(snakeCase(interfaceJson.name))
    }
  })

  const functionImports = functionNames.map(n => `from .${n} import ${n}`).join("\n")

  const dunderInit = `"""${packageName}: ${packageDescription}"""

${functionImports}

from ._version import __version__
`
  const dunderInitPath = path.join(packageDir, pypackage, '__init__.py')
  writeIfOverrideNotPresent(dunderInitPath, dunderInit, "#")
}

export default packageDunderInit
