// Generated file. To retain edits, remove this comment.

import {
  JsonCompatible,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import ReadDicomTagsOptions from './read-dicom-tags-options.js'
import ReadDicomTagsNodeResult from './read-dicom-tags-node-result.js'


import path from 'path'

/**
 * Read the tags from a DICOM file
 *
 * @param {string} dicomFile - Input DICOM file.
 * @param {ReadDicomTagsOptions} options - options object
 *
 * @returns {Promise<ReadDicomTagsNodeResult>} - result object
 */
async function readDicomTagsNode(
  dicomFile: string,
  options: ReadDicomTagsOptions = {}
) : Promise<ReadDicomTagsNodeResult> {

  const mountDirs: Set<string> = new Set()

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.JsonCompatible },
  ]

  mountDirs.add(path.dirname(dicomFile as string))
  const inputs: Array<PipelineInput> = [
  ]

  const args = []
  // Inputs
  const dicomFileName = dicomFile
  args.push(dicomFileName as string)

  // Outputs
  const tagsName = '0'
  args.push(tagsName)

  // Options
  args.push('--memory-io')
  if (typeof options.tagsToRead !== "undefined") {
    const inputCountString = inputs.length.toString()
    inputs.push({ type: InterfaceTypes.JsonCompatible, data: options.tagsToRead as JsonCompatible })
    args.push('--tags-to-read', inputCountString)

  }

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), '..', 'pipelines', 'read-dicom-tags')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs, mountDirs)
  if (returnValue !== 0) {
    throw new Error(stderr)
  }

  const result = {
    tags: outputs[0].data as JsonCompatible,
  }
  return result
}

export default readDicomTagsNode
