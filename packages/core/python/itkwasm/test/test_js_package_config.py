
def test_itkwasm_js_package_config():
  from itkwasm.pyodide import JsPackageConfig
  module_url = 'https://cdn.jsdelivr.net/npm/@itk-wasm/compress-stringify@0.4.2/dist/bundles/compress-stringify.js'
  pipelines_base_url = 'https://cdn.jsdelivr.net/npm/@itk-wasm/compress-stringify@0.4.2/dist/pipelines'
  pipeline_worker_url = 'https://cdn.jsdelivr.net/npm/@itk-wasm/compress-stringify@0.4.2/dist/web-workers/pipeline.worker.js'

  config = JsPackageConfig(module_url, pipelines_base_url, pipeline_worker_url)
  assert config.module_url == module_url
  assert config.pipelines_base_url == pipelines_base_url
  assert config.pipeline_worker_url ==  pipeline_worker_url

  config = JsPackageConfig(module_url)
  assert config.module_url == module_url
  assert config.pipelines_base_url is None
  assert config.pipeline_worker_url is None
