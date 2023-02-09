import {
  BinaryStream,
  InterfaceTypes,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import ReadDicomEncapsulatedPdfOptions from './ReadDicomEncapsulatedPdfOptions.js'
import ReadDicomEncapsulatedPdfResult from './ReadDicomEncapsulatedPdfResult.js'

/**
 * Extract PDF file from DICOM encapsulated PDF.
 *
 * @param {Uint8Array} dicomFile - Input DICOM file
 *
 * @returns {Promise<ReadDicomEncapsulatedPdfResult>} - result object
 */
async function readDicomEncapsulatedPdf(
  webWorker: null | Worker,
  dicomFile: Uint8Array,
  options: ReadDicomEncapsulatedPdfOptions = {})
    : Promise<ReadDicomEncapsulatedPdfResult> {

  const desiredOutputs = [
    { type: InterfaceTypes.BinaryStream },
  ]
  const inputs: [ PipelineInput ] = [
    { type: InterfaceTypes.BinaryFile, data: { data: dicomFile, path: "file0" }  },
  ]

  const args = []
  // Inputs
  args.push('file0')
  // Outputs
  args.push('0')
  // Options
  args.push('--memory-io')
  if (options.readFileOnly) {
    args.push('--read-file-only')
  }
  if (options.readDataset) {
    args.push('--read-dataset')
  }
  if (options.readXferAuto) {
    args.push('--read-xfer-auto')
  }
  if (options.readXferDetect) {
    args.push('--read-xfer-detect')
  }
  if (options.readXferLittle) {
    args.push('--read-xfer-little')
  }
  if (options.readXferBig) {
    args.push('--read-xfer-big')
  }
  if (options.readXferImplicit) {
    args.push('--read-xfer-implicit')
  }
  if (options.acceptOddLength) {
    args.push('--accept-odd-length')
  }
  if (options.assumeEvenLength) {
    args.push('--assume-even-length')
  }
  if (options.enableCp246) {
    args.push('--enable-cp246')
  }
  if (options.disableCp246) {
    args.push('--disable-cp246')
  }
  if (options.retainUn) {
    args.push('--retain-un')
  }
  if (options.convertUn) {
    args.push('--convert-un')
  }
  if (options.enableCorrection) {
    args.push('--enable-correction')
  }
  if (options.disableCorrection) {
    args.push('--disable-correction')
  }

  const pipelinePath = 'read-dicom-encapsulated-pdf'

  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(webWorker, pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0) {
    throw new Error(stderr)
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    pdfBinaryOutput: (outputs[0].data as BinaryStream).data,
  }
  return result
}

export default readDicomEncapsulatedPdf
