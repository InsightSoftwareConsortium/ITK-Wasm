from itkwasm.pyodide import JsPackageConfig, JsPackage

default_config = JsPackageConfig("https://cdn.jsdelivr.net/npm/@itk-wasm/compress-stringify@0.4.2/dist/bundles/compress-stringify.js")
js_package = JsPackage(default_config)
