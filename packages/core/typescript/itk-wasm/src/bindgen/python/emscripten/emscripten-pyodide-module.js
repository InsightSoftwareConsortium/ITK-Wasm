import path from 'path'

import writeIfOverrideNotPresent from '../../write-if-override-not-present.js'

function emscriptenPyodideModule(jsModuleContent, packageDir, pypackage) {
  const moduleContent = `from itkwasm.pyodide import JsPackageConfig, JsPackage

from ._version import __version__
default_js_module = """data:text/javascript;base64,${jsModuleContent}"""
default_config = JsPackageConfig(default_js_module)
js_package = JsPackage(default_config)
`

  const modulePath = path.join(packageDir, pypackage, 'js_package.py')

  writeIfOverrideNotPresent(modulePath, moduleContent, '#')
}

export default emscriptenPyodideModule
