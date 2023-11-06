import ITKConfig from './itk-config.js'

interface WebWorkerInput {
  operation: 'runPipeline' | 'runPolyDataIOPipeline' | 'readImage' | 'writeImage' | 'readMesh' | 'writeMesh' | 'meshToPolyData' |  'polyDataToMesh'
  config: ITKConfig
}

export default WebWorkerInput
