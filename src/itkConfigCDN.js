const itkConfig = {
  pipelineWorkerUrl: __webpack_public_path__ + 'itk-wasm@' + __itk_version__ + '/dist/web-workers/bundles/pipeline.worker.js', // eslint-disable-line no-undef
  imageIOUrl: __webpack_public_path__ + 'itk-image-io@' + __itk_version__, // eslint-disable-line no-undef
  meshIOUrl: __webpack_public_path__ + 'itk-mesh-io@' + __itk_version__, // eslint-disable-line no-undef
  pipelinesUrl: __webpack_public_path__ + 'itk-wasm@' + __itk_version__ + '/dist/pipeline', // eslint-disable-line no-undef
}

export default itkConfig
