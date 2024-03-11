// Generated file. To retain edits, remove this comment.

import {
  BinaryStream,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import ReadDicomEncapsulatedPdfNodeOptions from './read-dicom-encapsulated-pdf-node-options.js'
import ReadDicomEncapsulatedPdfNodeResult from './read-dicom-encapsulated-pdf-node-result.js'

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Extract PDF file from DICOM encapsulated PDF.
 *
 * @param {string} dicomFile - Input DICOM file
 * @param {ReadDicomEncapsulatedPdfNodeOptions} options - options object
 *
 * @returns {Promise<ReadDicomEncapsulatedPdfNodeResult>} - result object
 */
async function readDicomEncapsulatedPdfNode(
  dicomFile: string,
  options: ReadDicomEncapsulatedPdfNodeOptions = {}
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
  args.push(dicomFileName)
  mountDirs.add(path.dirname(dicomFileName))

  // Outputs
  const pdfBinaryOutputName = '0'
  args.push(pdfBinaryOutputName)

  // Options
  args.push('--memory-io')
  if (options.readFileOnly) {
    options.readFileOnly && args.push('--read-file-only')
  }
  if (options.readDataset) {
    options.readDataset && args.push('--read-dataset')
  }
  if (options.readXferAuto) {
    options.readXferAuto && args.push('--read-xfer-auto')
  }
  if (options.readXferDetect) {
    options.readXferDetect && args.push('--read-xfer-detect')
  }
  if (options.readXferLittle) {
    options.readXferLittle && args.push('--read-xfer-little')
  }
  if (options.readXferBig) {
    options.readXferBig && args.push('--read-xfer-big')
  }
  if (options.readXferImplicit) {
    options.readXferImplicit && args.push('--read-xfer-implicit')
  }
  if (options.acceptOddLength) {
    options.acceptOddLength && args.push('--accept-odd-length')
  }
  if (options.assumeEvenLength) {
    options.assumeEvenLength && args.push('--assume-even-length')
  }
  if (options.enableCp246) {
    options.enableCp246 && args.push('--enable-cp246')
  }
  if (options.disableCp246) {
    options.disableCp246 && args.push('--disable-cp246')
  }
  if (options.retainUn) {
    options.retainUn && args.push('--retain-un')
  }
  if (options.convertUn) {
    options.convertUn && args.push('--convert-un')
  }
  if (options.enableCorrection) {
    options.enableCorrection && args.push('--enable-correction')
  }
  if (options.disableCorrection) {
    options.disableCorrection && args.push('--disable-correction')
  }

  const pipelinePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'pipelines', 'read-dicom-encapsulated-pdf')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs, mountDirs)
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    pdfBinaryOutput: (outputs[0]?.data as BinaryStream).data,
  }
  return result
}

export default readDicomEncapsulatedPdfNode
