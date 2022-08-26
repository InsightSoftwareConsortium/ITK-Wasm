const itkConfig = {
  pipelineWorkerUrl: __BASE_PATH__ + '/dist/web-workers/bundles/pipeline.worker.js', // eslint-disable-line no-undef
  imageIOUrl: __BASE_PATH__ + '/dist/image-io', // eslint-disable-line no-undef
  meshIOUrl: __BASE_PATH__ + '/dist/mesh-io', // eslint-disable-line no-undef
  pipelinesUrl: __BASE_PATH__ + '/dist/pipeline' // eslint-disable-line no-undef
}

export default itkConfig