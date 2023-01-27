const version = '1.0.0-b.21'

const itkConfig = {
  pipelineWorkerUrl: '/dist/pipelines/web-workers/pipeline.worker.js',
  imageIOUrl: `https://cdn.jsdelivr.net/npm/itk-image-io@${version}`,
  meshIOUrl: `https://cdn.jsdelivr.net/npm/itk-mesh-io@${version}`,
  pipelinesUrl: '/dist/pipelines'
}

export default itkConfig
