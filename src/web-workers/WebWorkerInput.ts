import ITKConfig from './ITKConfig.js'

interface WebWorkerInput {
  operation: 'runPipeline' | 'runPolyDataIOPipeline' | 'readImage' | 'writeImage' | 'readMesh' | 'writeMesh' | 'readDICOMImageSeries' | 'readDICOMTags'
  config: ITKConfig
}

export default WebWorkerInput
