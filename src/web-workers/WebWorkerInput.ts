import ITKConfig from './ITKConfig.js'

interface WebWorkerInput {
  operation: 'runPipeline' | 'runPolyDataIOPipeline' | 'readImage' | 'writeImage' | 'readDICOMImageSeries' | 'readDICOMTags'
  config: ITKConfig
}

export default WebWorkerInput
