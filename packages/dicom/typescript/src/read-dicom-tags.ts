// Generated file. To retain edits, remove this comment.

import {
  BinaryFile,
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
 * @param {File | BinaryFile} dicomFile - Input DICOM file.
 * @param {ReadDicomTagsOptions} options - options object
 *
 * @returns {Promise<ReadDicomTagsResult>} - result object
 */
async function readDicomTags(
  webWorker: null | Worker,
  dicomFile: File | BinaryFile,
  options: ReadDicomTagsOptions = {}
) : Promise<ReadDicomTagsResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonObject },
  ]

  let dicomFileFile = dicomFile
  if (dicomFile instanceof File) {
    const dicomFileBuffer = await dicomFile.arrayBuffer()
    dicomFileFile = { path: dicomFile.name, data: new Uint8Array(dicomFileBuffer) }
  }
  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.BinaryFile, data: dicomFileFile as BinaryFile },
  ]

  const args = []
  // Inputs
  const dicomFileName = (dicomFileFile as BinaryFile).path
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
