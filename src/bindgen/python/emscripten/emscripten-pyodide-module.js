import fs from 'fs-extra'
import path from 'path'

import writeIfOverrideNotPresent from '../../write-if-override-not-present.js'

function emscriptenPyodideModule(outputDir, packageDir, pypackage, options) {
  const defaultJsModuleName = options.packageName.replace('itkwasm-', '')
  const defaultJsModulePath = path.join(outputDir, '..', 'typescript', 'dist', `${defaultJsModuleName}-worker-embedded.js`)
  const moduleUrl = options.jsModulePath ?? defaultJsModulePath
  if (!fs.existsSync(moduleUrl)) {
    console.error(`Could not find ${moduleUrl}`)
    process.exit(1)
  }
  const jsModuleContent = fs.readFileSync(moduleUrl, { encoding: 'utf8', flag: 'r' })

  const moduleContent = `from itkwasm.pyodide import JsPackageConfig, JsPackage

from ._version import __version__
default_js_module = """data:text/javascript;charset=utf-8,${jsModuleContent}"""
default_config = JsPackageConfig(default_js_module)
js_package = JsPackage(default_config)
`

  const modulePath = path.join(packageDir, pypackage, 'js_package.py')

  writeIfOverrideNotPresent(modulePath, moduleContent, '#')
}

export default emscriptenPyodideModule
