import ITKConfig from './itk-config.js'
import PipelineOutput from '../../pipeline/PipelineOutput.js'
import PipelineInput from '../../pipeline/PipelineInput.js'
import MeshToPolyDataPipelineResult from './mesh-to-poly-data-pipeline-result.js'
import PolyDataToMeshPipelineResult from './poly-data-to-mesh-pipeline-result.js'
import ReadImagePipelineResult from './read-image-pipeline-result.js'
import WriteImagePipelineResult from './write-image-pipeline-result.js'
import ReadMeshPipelineResult from './read-mesh-pipeline-result.js'
import WriteMeshPipelineResult from './write-mesh-pipeline-result.js'
import RunPipelineWorkerResult from './run-pipeline-worker-result.js'

interface WorkerOperations {
  meshToPolyData: (config: ITKConfig, args: string[], outputs: PipelineOutput[], inputs: PipelineInput[]) => MeshToPolyDataPipelineResult
  polyDataToMesh: (config: ITKConfig, args: string[], outputs: PipelineOutput[], inputs: PipelineInput[]) => PolyDataToMeshPipelineResult
  readImage: (config: ITKConfig, mimeType: string, fileName: string, args: string[], outputs: PipelineOutput[], inputs: PipelineInput[]) => ReadImagePipelineResult
  writeImage: (config: ITKConfig, mimeType: string, fileName: string, args: string[], outputs: PipelineOutput[], inputs: PipelineInput[]) => WriteImagePipelineResult
  readMesh: (config: ITKConfig, mimeType: string, fileName: string, args: string[], outputs: PipelineOutput[], inputs: PipelineInput[]) => ReadMeshPipelineResult
  writeMesh: (config: ITKConfig, mimeType: string, fileName: string, args: string[], outputs: PipelineOutput[], inputs: PipelineInput[]) => WriteMeshPipelineResult
  runPipeline: (config: ITKConfig, pipelinePath: string, pipelineBaseUrl: string, args: string[], outputs: PipelineOutput[] | null, inputs: PipelineInput[] | null) => RunPipelineWorkerResult
}

export default WorkerOperations