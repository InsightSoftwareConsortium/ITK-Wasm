import fs from 'fs-extra'
import path from 'path'

function emscriptenPyodideModule(packageDir, pypackage, options) {
  const defaultJsPackageName = options.packageName.replace('itkwasm-', '@itk-wasm/')
  const defaultJsModuleName = options.packageName.replace('itkwasm-', '')
  const version = options.packageVersion ?? '0.1.0'

  const moduleUrl = options.jsModuleUrl ?? `https://cdn.jsdelivr.net/npm/${defaultJsPackageName}@{__version__}/dist/bundles/${defaultJsModuleName}.js`

  const moduleContent = `from itkwasm.pyodide import JsPackageConfig, JsPackage

from ._version import __version__

default_config = JsPackageConfig(f"${moduleUrl}")
js_package = JsPackage(default_config)
`

  const modulePath = path.join(packageDir, pypackage, 'js_package.py')

  if (!fs.existsSync(modulePath)) {
    fs.writeFileSync(modulePath, moduleContent)
  }
}

export default emscriptenPyodideModule
