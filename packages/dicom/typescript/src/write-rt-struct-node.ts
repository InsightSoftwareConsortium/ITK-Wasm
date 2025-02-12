// Generated file. To retain edits, remove this comment.

import {
  JsonCompatible,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import WriteRtStructNodeOptions from './write-rt-struct-node-options.js'
import WriteRtStructNodeResult from './write-rt-struct-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Write a DICOM RT Struct Structured Set for the given ROI contours and DICOM metadata
 *
 * @param {string} inputCxt - Input Plastimatch CXT structure set file
 * @param {string} outputDicom - Output DICOM RT Struct Structure Set file
 * @param {WriteRtStructNodeOptions} options - options object
 *
 * @returns {Promise<WriteRtStructNodeResult>} - result object
 */
async function writeRtStructNode(
  inputCxt: string,
  outputDicom: string,
  options: WriteRtStructNodeOptions = {}
) : Promise<WriteRtStructNodeResult> {

  const mountDirs: Set<string> = new Set()

  const desiredOutputs: Array<PipelineOutput> = [
  ]

  mountDirs.add(path.dirname(inputCxt as string))
  const inputs: Array<PipelineInput> = [
  ]

  const args = []
  // Inputs
  const inputCxtName = inputCxt
  args.push(inputCxtName)
  mountDirs.add(path.dirname(inputCxtName))

  // Outputs
  const outputDicomName = outputDicom
  args.push(outputDicomName)
  mountDirs.add(path.dirname(outputDicomName))

  // Options
  args.push('--memory-io')
  if (options.dicomMetadata) {
    const inputCountString = inputs.length.toString()
    inputs.push({ type: InterfaceTypes.JsonCompatible, data: options.dicomMetadata as JsonCompatible })
    args.push('--dicom-metadata', inputCountString)

  }

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'write-rt-struct')

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

export default writeRtStructNode
