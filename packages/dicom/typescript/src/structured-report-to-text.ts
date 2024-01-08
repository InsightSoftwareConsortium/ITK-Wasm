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
  if (typeof options.unknownRelationship !== "undefined") {
    options.unknownRelationship && args.push('--unknown-relationship')
  }
  if (typeof options.invalidItemValue !== "undefined") {
    options.invalidItemValue && args.push('--invalid-item-value')
  }
  if (typeof options.ignoreConstraints !== "undefined") {
    options.ignoreConstraints && args.push('--ignore-constraints')
  }
  if (typeof options.ignoreItemErrors !== "undefined") {
    options.ignoreItemErrors && args.push('--ignore-item-errors')
  }
  if (typeof options.skipInvalidItems !== "undefined") {
    options.skipInvalidItems && args.push('--skip-invalid-items')
  }
  if (typeof options.noDocumentHeader !== "undefined") {
    options.noDocumentHeader && args.push('--no-document-header')
  }
  if (typeof options.numberNestedItems !== "undefined") {
    options.numberNestedItems && args.push('--number-nested-items')
  }
  if (typeof options.shortenLongValues !== "undefined") {
    options.shortenLongValues && args.push('--shorten-long-values')
  }
  if (typeof options.printInstanceUid !== "undefined") {
    options.printInstanceUid && args.push('--print-instance-uid')
  }
  if (typeof options.printSopclassShort !== "undefined") {
    options.printSopclassShort && args.push('--print-sopclass-short')
  }
  if (typeof options.printSopclassLong !== "undefined") {
    options.printSopclassLong && args.push('--print-sopclass-long')
  }
  if (typeof options.printSopclassUid !== "undefined") {
    options.printSopclassUid && args.push('--print-sopclass-uid')
  }
  if (typeof options.printAllCodes !== "undefined") {
    options.printAllCodes && args.push('--print-all-codes')
  }
  if (typeof options.printInvalidCodes !== "undefined") {
    options.printInvalidCodes && args.push('--print-invalid-codes')
  }
  if (typeof options.printTemplateId !== "undefined") {
    options.printTemplateId && args.push('--print-template-id')
  }
  if (typeof options.indicateEnhanced !== "undefined") {
    options.indicateEnhanced && args.push('--indicate-enhanced')
  }
  if (typeof options.printColor !== "undefined") {
    options.printColor && args.push('--print-color')
  }

  const pipelinePath = 'structured-report-to-text'

  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl(), webWorker: options?.webWorker ?? await getDefaultWebWorker(), noCopy: options?.noCopy })
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
