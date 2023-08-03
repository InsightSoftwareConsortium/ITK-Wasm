// Generated file. To retain edits, remove this comment.

import {
  BinaryStream,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import ReadDicomEncapsulatedPdfOptions from './read-dicom-encapsulated-pdf-options.js'
import ReadDicomEncapsulatedPdfNodeResult from './read-dicom-encapsulated-pdf-node-result.js'


import path from 'path'

/**
 * Extract PDF file from DICOM encapsulated PDF.
 *
 * @param {string} dicomFile - Input DICOM file
 * @param {ReadDicomEncapsulatedPdfOptions} options - options object
 *
 * @returns {Promise<ReadDicomEncapsulatedPdfNodeResult>} - result object
 */
async function readDicomEncapsulatedPdfNode(
  dicomFile: string,
  options: ReadDicomEncapsulatedPdfOptions = {}
) : Promise<ReadDicomEncapsulatedPdfNodeResult> {

  const mountDirs: Set<string> = new Set()

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.BinaryStream },
  ]

  mountDirs.add(path.dirname(dicomFile as string))
  const inputs: Array<PipelineInput> = [
  ]

  const args = []
  // Inputs
  const dicomFileName = dicomFile
  args.push(dicomFileName as string)

  // Outputs
  const pdfBinaryOutputName = '0'
  args.push(pdfBinaryOutputName)

  // Options
  args.push('--memory-io')
  if (typeof options.readFileOnly !== "undefined") {
    options.readFileOnly && args.push('--read-file-only')
  }
  if (typeof options.readDataset !== "undefined") {
    options.readDataset && args.push('--read-dataset')
  }
  if (typeof options.readXferAuto !== "undefined") {
    options.readXferAuto && args.push('--read-xfer-auto')
  }
  if (typeof options.readXferDetect !== "undefined") {
    options.readXferDetect && args.push('--read-xfer-detect')
  }
  if (typeof options.readXferLittle !== "undefined") {
    options.readXferLittle && args.push('--read-xfer-little')
  }
  if (typeof options.readXferBig !== "undefined") {
    options.readXferBig && args.push('--read-xfer-big')
  }
  if (typeof options.readXferImplicit !== "undefined") {
    options.readXferImplicit && args.push('--read-xfer-implicit')
  }
  if (typeof options.acceptOddLength !== "undefined") {
    options.acceptOddLength && args.push('--accept-odd-length')
  }
  if (typeof options.assumeEvenLength !== "undefined") {
    options.assumeEvenLength && args.push('--assume-even-length')
  }
  if (typeof options.enableCp246 !== "undefined") {
    options.enableCp246 && args.push('--enable-cp246')
  }
  if (typeof options.disableCp246 !== "undefined") {
    options.disableCp246 && args.push('--disable-cp246')
  }
  if (typeof options.retainUn !== "undefined") {
    options.retainUn && args.push('--retain-un')
  }
  if (typeof options.convertUn !== "undefined") {
    options.convertUn && args.push('--convert-un')
  }
  if (typeof options.enableCorrection !== "undefined") {
    options.enableCorrection && args.push('--enable-correction')
  }
  if (typeof options.disableCorrection !== "undefined") {
    options.disableCorrection && args.push('--disable-correction')
  }

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), '..', 'pipelines', 'read-dicom-encapsulated-pdf')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs, mountDirs)
  if (returnValue !== 0) {
    throw new Error(stderr)
  }

  const result = {
    pdfBinaryOutput: (outputs[0].data as BinaryStream).data,
  }
  return result
}

export default readDicomEncapsulatedPdfNode
