// Generated file. Do not edit.

import {
  TextFile,
  JsonObject,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import ReadDicomTagsOptions from './read-dicom-tags-options.js'
import ReadDicomTagsResult from './read-dicom-tags-result.js'


import { getPipelinesBaseUrl } from './pipelines-base-url.js'


import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

/**
 * Read the tags from a DICOM file
 *
 * @param {File | TextFile} dicomFile - Input DICOM file.
 * @param {ReadDicomTagsOptions} options - options object
 *
 * @returns {Promise<ReadDicomTagsResult>} - result object
 */
async function readDicomTags(
  webWorker: null | Worker,
  dicomFile: File | TextFile,
  options: ReadDicomTagsOptions = {}
) : Promise<ReadDicomTagsResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonObject },
  ]
  let dicomFileFile = dicomFile
  if (dicomFile instanceof File) {
    const dicomFileBuffer = await dicomFile.arrayBuffer()
    dicomFileFile = { path: dicomFile.name, data: new TextDecoder().decode(dicomFileBuffer) }
  }
  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.TextFile, data: dicomFileFile as TextFile },
  ]

  const args = []
  // Inputs
  const dicomFileName = dicomFile instanceof File ? dicomFile.name : dicomFile.path
  args.push(dicomFileName as string)
  // Outputs
  const tagsName = '0'
  args.push(tagsName)
  // Options
  args.push('--memory-io')
  if (typeof options.tagsToRead !== "undefined") {
    const inputCountString = inputs.length.toString()
    inputs.push({ type: InterfaceTypes.JsonObject, data: options.tagsToRead as JsonObject })
    args.push('--tags-to-read', inputCountString)
  }

  const pipelinePath = 'read-dicom-tags'

  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(webWorker, pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl() })
  if (returnValue !== 0) {
    throw new Error(stderr)
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    tags: (outputs[0].data as JsonObject).data,
  }
  return result
}

export default readDicomTags
