// Generated file. To retain edits, remove this comment.

import {
  BinaryFile,
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

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Extract PDF file from DICOM encapsulated PDF.
 *
 * @param {File | BinaryFile} dicomFile - Input DICOM file
 * @param {ReadDicomEncapsulatedPdfOptions} options - options object
 *
 * @returns {Promise<ReadDicomEncapsulatedPdfResult>} - result object
 */
async function readDicomEncapsulatedPdf(
  dicomFile: File | BinaryFile,
  options: ReadDicomEncapsulatedPdfOptions = {}
) : Promise<ReadDicomEncapsulatedPdfResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.BinaryStream },
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
  args.push(dicomFileName)

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

  const pipelinePath = 'read-dicom-encapsulated-pdf'

  let workerToUse = options?.webWorker
  if (workerToUse === undefined) {
    workerToUse = await getDefaultWebWorker()
  }
  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl(), webWorker: workerToUse, noCopy: options?.noCopy })
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    pdfBinaryOutput: (outputs[0]?.data as BinaryStream).data,
  }
  return result
}

export default readDicomEncapsulatedPdf
