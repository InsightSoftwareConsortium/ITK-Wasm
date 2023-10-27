import registerWebworker from 'webworker-promise/lib/register.js'

import loadPipelineModule from './load-pipeline-module.js'
import loadImageIOPipelineModule from './load-image-io-pipeline-module.js'
import loadMeshIOPipelineModule from './load-mesh-io-pipeline-module.js'
import runPipeline from './run-pipeline.js'
import RunPipelineInput from './run-pipeline-input.js'
import IOInput from './io-input.js'

registerWebworker(async function (input: RunPipelineInput | IOInput) {
  let pipelineModule = null
  if (input.operation === 'runPipeline') {
    const pipelineBaseUrl = typeof input.config[input.pipelineBaseUrl] === 'undefined' ? input.pipelineBaseUrl : input.config[input.pipelineBaseUrl] as string
    pipelineModule = await loadPipelineModule(input.pipelinePath, pipelineBaseUrl)
  } else if (input.operation === 'readImage') {
    pipelineModule = await loadImageIOPipelineModule(input as IOInput, '-read-image')
  } else if (input.operation === 'writeImage') {
    pipelineModule = await loadImageIOPipelineModule(input as IOInput, '-write-image')
  } else if (input.operation === 'readMesh') {
    pipelineModule = await loadMeshIOPipelineModule(input as IOInput, '-read-mesh')
  } else if (input.operation === 'writeMesh') {
    pipelineModule = await loadMeshIOPipelineModule(input as IOInput, '-write-mesh')
  } else if (input.operation === 'meshToPolyData') {
    pipelineModule = await loadPipelineModule('mesh-to-polydata', input.config.meshIOUrl)
  } else if (input.operation === 'polyDataToMesh') {
    pipelineModule = await loadPipelineModule('polydata-to-mesh', input.config.meshIOUrl)
  } else if (input.operation === 'readDICOMImageSeries') {
    pipelineModule = await loadPipelineModule('read-image-dicom-file-series', input.config.imageIOUrl)
  } else if (input.operation === 'readDICOMTags') {
    pipelineModule = await loadPipelineModule('read-dicom-tags', input.config.imageIOUrl)
  } else {
    throw new Error('Unknown worker operation')
  }
  return runPipeline(pipelineModule, input.args, input.outputs, input.inputs)
})
