import {
  BinaryStream,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import ReadDicomEncapsulatedPdfOptions from './read-dicom-encapsulated-pdf-options.js'
import ReadDicomEncapsulatedPdfResult from './read-dicom-encapsulated-pdf-result.js'


import { getPipelinesBaseUrl } from './pipelines-base-url.js'


import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

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
  options: ReadDicomEncapsulatedPdfOptions = {}
) : Promise<ReadDicomEncapsulatedPdfResult> {

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

  const pipelinePath = 'read-dicom-encapsulated-pdf'

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
    pdfBinaryOutput: (outputs[0].data as BinaryStream).data,
  }
  return result
}

export default readDicomEncapsulatedPdf
