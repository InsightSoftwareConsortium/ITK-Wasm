import * as Comlink from 'comlink'

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
import loadPipelineModule from './load-pipeline-module.js'
import loadImageIOPipelineModule from './load-image-io-pipeline-module.js'
import loadMeshIOPipelineModule from './load-mesh-io-pipeline-module.js'
import runPipeline from './run-pipeline.js'
import RunPipelineInput from './run-pipeline-input.js'
import IOInput from './io-input.js'

const workerOperations = {
  meshToPolyData: async function (config: ITKConfig, args: string[], outputs: PipelineOutput[], inputs: PipelineInput[]): Promise<MeshToPolyDataPipelineResult> {
    const pipelineModule = await loadPipelineModule('mesh-to-polydata', config.meshIOUrl)
    return runPipeline(pipelineModule, args, outputs, inputs)
  },

  polyDataToMesh: async function (config: ITKConfig, args: string[], outputs: PipelineOutput[], inputs: PipelineInput[]): Promise<PolyDataToMeshPipelineResult> {
    const pipelineModule = await loadPipelineModule('polydata-to-mesh', config.meshIOUrl)
    return runPipeline(pipelineModule, args, outputs, inputs)
  },

  readImage: async function (config: ITKConfig, mimeType: string, fileName: string, args: string[], outputs: PipelineOutput[], inputs: PipelineInput[]): Promise<ReadImagePipelineResult> {
    const pipelineModule = await loadImageIOPipelineModule({ fileName, mimeType, config, args, outputs, inputs } as IOInput, '-read-image')
    return runPipeline(pipelineModule, args, outputs, inputs)
  },

  writeImage: async function (config: ITKConfig, mimeType: string, fileName: string, args: string[], outputs: PipelineOutput[], inputs: PipelineInput[]): Promise<WriteImagePipelineResult> {
    const pipelineModule = await loadImageIOPipelineModule({ fileName, mimeType, config, args, outputs, inputs } as IOInput, '-write-image')
    return runPipeline(pipelineModule, args, outputs, inputs)
  },

  readMesh: async function (config: ITKConfig, mimeType: string, fileName: string, args: string[], outputs: PipelineOutput[], inputs: PipelineInput[]): Promise<ReadMeshPipelineResult> {
    const pipelineModule = await loadMeshIOPipelineModule({ fileName, mimeType, config, args, outputs, inputs } as IOInput, '-read-mesh')
    return runPipeline(pipelineModule, args, outputs, inputs)
  },

  writeMesh: async function (config: ITKConfig, mimeType: string, fileName: string, args: string[], outputs: PipelineOutput[], inputs: PipelineInput[]): Promise<WriteMeshPipelineResult> {
    const pipelineModule = await loadMeshIOPipelineModule({ fileName, mimeType, config, args, outputs, inputs } as IOInput, '-write-mesh')
    return runPipeline(pipelineModule, args, outputs, inputs)
  },

  runPipeline: async function (config: ITKConfig, pipelinePath: string, pipelineBaseUrl: string, args: string[], outputs: PipelineOutput[] | null, inputs: PipelineInput[] | null): Promise<RunPipelineWorkerResult> {
    const resolvedPipelineBaseUrl = typeof config[pipelineBaseUrl] === 'undefined' ? pipelineBaseUrl : config[pipelineBaseUrl] as string
    const pipelineModule = await loadPipelineModule(pipelinePath, resolvedPipelineBaseUrl)
    return runPipeline(pipelineModule, args, outputs, inputs)
  },
}

Comlink.expose(workerOperations)