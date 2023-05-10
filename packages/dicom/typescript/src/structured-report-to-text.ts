// Generated file. Do not edit.

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

/**
 * Read a DICOM structured report file and generate a plain text representation
 *
 * @param {File | BinaryFile} dicomFile - Input DICOM file
 * @param {StructuredReportToTextOptions} options - options object
 *
 * @returns {Promise<StructuredReportToTextResult>} - result object
 */
async function structuredReportToText(
  webWorker: null | Worker,
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
  const dicomFileName = dicomFile instanceof File ? dicomFile.name : dicomFile.path
  args.push(dicomFileName as string)
  // Outputs
  const outputTextName = '0'
  args.push(outputTextName)
  // Options
  args.push('--memory-io')
  if (typeof options.unknownRelationship !== "undefined") {
    args.push('--unknown-relationship')
  }
  if (typeof options.invalidItemValue !== "undefined") {
    args.push('--invalid-item-value')
  }
  if (typeof options.ignoreConstraints !== "undefined") {
    args.push('--ignore-constraints')
  }
  if (typeof options.ignoreItemErrors !== "undefined") {
    args.push('--ignore-item-errors')
  }
  if (typeof options.skipInvalidItems !== "undefined") {
    args.push('--skip-invalid-items')
  }
  if (typeof options.noDocumentHeader !== "undefined") {
    args.push('--no-document-header')
  }
  if (typeof options.numberNestedItems !== "undefined") {
    args.push('--number-nested-items')
  }
  if (typeof options.shortenLongValues !== "undefined") {
    args.push('--shorten-long-values')
  }
  if (typeof options.printInstanceUid !== "undefined") {
    args.push('--print-instance-uid')
  }
  if (typeof options.printSopclassShort !== "undefined") {
    args.push('--print-sopclass-short')
  }
  if (typeof options.printSopclassLong !== "undefined") {
    args.push('--print-sopclass-long')
  }
  if (typeof options.printSopclassUid !== "undefined") {
    args.push('--print-sopclass-uid')
  }
  if (typeof options.printAllCodes !== "undefined") {
    args.push('--print-all-codes')
  }
  if (typeof options.printInvalidCodes !== "undefined") {
    args.push('--print-invalid-codes')
  }
  if (typeof options.printTemplateId !== "undefined") {
    args.push('--print-template-id')
  }
  if (typeof options.indicateEnhanced !== "undefined") {
    args.push('--indicate-enhanced')
  }
  if (typeof options.printColor !== "undefined") {
    args.push('--print-color')
  }

  const pipelinePath = 'structured-report-to-text'

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
    outputText: (outputs[0].data as TextStream).data,
  }
  return result
}

export default structuredReportToText
