// Generated file. To retain edits, remove this comment.

import {
  BinaryFile,
  TextStream,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import StructuredReportToTextOptions from './structured-report-to-text-options.js'
import StructuredReportToTextResult from './structured-report-to-text-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

import { getDefaultWebWorker } from './default-web-worker.js'

/**
 * Read a DICOM structured report file and generate a plain text representation
 *
 * @param {File | BinaryFile} dicomFile - Input DICOM file
 * @param {StructuredReportToTextOptions} options - options object
 *
 * @returns {Promise<StructuredReportToTextResult>} - result object
 */
async function structuredReportToText(
  dicomFile: File | BinaryFile,
  options: StructuredReportToTextOptions = {}
) : Promise<StructuredReportToTextResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.TextStream },
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
  const outputTextName = '0'
  args.push(outputTextName)

  // Options
  args.push('--memory-io')
  if (options.unknownRelationship) {
    options.unknownRelationship && args.push('--unknown-relationship')
  }
  if (options.invalidItemValue) {
    options.invalidItemValue && args.push('--invalid-item-value')
  }
  if (options.ignoreConstraints) {
    options.ignoreConstraints && args.push('--ignore-constraints')
  }
  if (options.ignoreItemErrors) {
    options.ignoreItemErrors && args.push('--ignore-item-errors')
  }
  if (options.skipInvalidItems) {
    options.skipInvalidItems && args.push('--skip-invalid-items')
  }
  if (options.noDocumentHeader) {
    options.noDocumentHeader && args.push('--no-document-header')
  }
  if (options.numberNestedItems) {
    options.numberNestedItems && args.push('--number-nested-items')
  }
  if (options.shortenLongValues) {
    options.shortenLongValues && args.push('--shorten-long-values')
  }
  if (options.printInstanceUid) {
    options.printInstanceUid && args.push('--print-instance-uid')
  }
  if (options.printSopclassShort) {
    options.printSopclassShort && args.push('--print-sopclass-short')
  }
  if (options.printSopclassLong) {
    options.printSopclassLong && args.push('--print-sopclass-long')
  }
  if (options.printSopclassUid) {
    options.printSopclassUid && args.push('--print-sopclass-uid')
  }
  if (options.printAllCodes) {
    options.printAllCodes && args.push('--print-all-codes')
  }
  if (options.printInvalidCodes) {
    options.printInvalidCodes && args.push('--print-invalid-codes')
  }
  if (options.printTemplateId) {
    options.printTemplateId && args.push('--print-template-id')
  }
  if (options.indicateEnhanced) {
    options.indicateEnhanced && args.push('--indicate-enhanced')
  }
  if (options.printColor) {
    options.printColor && args.push('--print-color')
  }

  const pipelinePath = 'structured-report-to-text'

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
    outputText: (outputs[0]?.data as TextStream).data,
  }
  return result
}

export default structuredReportToText
