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
 * @param {Uint8Array} dicomFile - Input DICOM file
 *
 * @returns {Promise<ReadDicomEncapsulatedPdfNodeResult>} - result object
 */
async function readDicomEncapsulatedPdfNode(
  dicomFile: Uint8Array,
  options: ReadDicomEncapsulatedPdfOptions = {}
) : Promise<ReadDicomEncapsulatedPdfNodeResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.BinaryStream },
  ]
  const inputs: Array<PipelineInput> = [
    { type: InterfaceTypes.BinaryFile, data: { data: dicomFile, path: "file0" }  },
  ]

  const args = []
  // Inputs
  args.push('file0')
  // Outputs
  args.push('0')
  // Options
  args.push('--memory-io')
  if (typeof options.readFileOnly !== "undefined") {
    args.push('--read-file-only')
  }
  if (typeof options.readDataset !== "undefined") {
    args.push('--read-dataset')
  }
  if (typeof options.readXferAuto !== "undefined") {
    args.push('--read-xfer-auto')
  }
  if (typeof options.readXferDetect !== "undefined") {
    args.push('--read-xfer-detect')
  }
  if (typeof options.readXferLittle !== "undefined") {
    args.push('--read-xfer-little')
  }
  if (typeof options.readXferBig !== "undefined") {
    args.push('--read-xfer-big')
  }
  if (typeof options.readXferImplicit !== "undefined") {
    args.push('--read-xfer-implicit')
  }
  if (typeof options.acceptOddLength !== "undefined") {
    args.push('--accept-odd-length')
  }
  if (typeof options.assumeEvenLength !== "undefined") {
    args.push('--assume-even-length')
  }
  if (typeof options.enableCp246 !== "undefined") {
    args.push('--enable-cp246')
  }
  if (typeof options.disableCp246 !== "undefined") {
    args.push('--disable-cp246')
  }
  if (typeof options.retainUn !== "undefined") {
    args.push('--retain-un')
  }
  if (typeof options.convertUn !== "undefined") {
    args.push('--convert-un')
  }
  if (typeof options.enableCorrection !== "undefined") {
    args.push('--enable-correction')
  }
  if (typeof options.disableCorrection !== "undefined") {
    args.push('--disable-correction')
  }

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), '..', 'pipelines', 'read-dicom-encapsulated-pdf')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0) {
    throw new Error(stderr)
  }

  const result = {
    pdfBinaryOutput: (outputs[0].data as BinaryStream).data,
  }
  return result
}

export default readDicomEncapsulatedPdfNode
