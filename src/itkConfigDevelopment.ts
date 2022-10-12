const version = '0.0.0-semantically-released'

const itkConfig = {
  webWorkersUrl: undefined,
  pipelineWorkerUrl: `https://cdn.jsdelivr.net/npm/itk-wasm@${version}/dist/web-workers/bundles/pipeline.worker.js`,
  imageIOUrl: `https://cdn.jsdelivr.net/npm/itk-image-io@${version}`,
  meshIOUrl: `https://cdn.jsdelivr.net/npm/itk-mesh-io@${version}`,
  pipelinesUrl: `https://cdn.jsdelivr.net/npm/itk-wasm@${version}/dist/pipelines`
}

export default itkConfig
