import ITKConfig from './itk-config.js'

interface WebWorkerInput {
  operation: 'runPipeline' | 'runPolyDataIOPipeline' | 'readImage' | 'writeImage' | 'readMesh' | 'writeMesh' | 'meshToPolyData' |  'polyDataToMesh' | 'readDICOMImageSeries' | 'readDICOMTags'
  config: ITKConfig
}

export default WebWorkerInput
