// Generated file. To retain edits, remove this comment.

import {
  Image,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import WriteSegmentationNodeResult from './write-segmentation-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Write DICOM segmentation object
 *
 * @param {Image} inputImage - input segmentation image to write
 * @param {string} inputRefDicomSeries - input reference dicom series over which the segmentation was created
 * @param {string} outputDicomFile - written dicom segfile
 *
 * @returns {Promise<WriteSegmentationNodeResult>} - result object
 */
async function writeSegmentationNode(
  inputImage: Image,
  inputRefDicomSeries: string,
  outputDicomFile: string
) : Promise<WriteSegmentationNodeResult> {

  const mountDirs: Set<string> = new Set()

  const desiredOutputs: Array<PipelineOutput> = [
  ]

  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.Image, data: inputImage },
  ]

  const args = []
  // Inputs
  const inputImageName = '0'
  args.push(inputImageName)

  args.push(inputRefDicomSeries.toString())

  // Outputs
  const outputDicomFileName = outputDicomFile
  args.push(outputDicomFileName)
  mountDirs.add(path.dirname(outputDicomFileName))

  // Options
  args.push('--memory-io')

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'write-segmentation')

  const {
    returnValue,
    stderr,
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs, mountDirs)
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
  }
  return result
}

export default writeSegmentationNode
