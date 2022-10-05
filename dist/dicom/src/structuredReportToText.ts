import {
  TextStream,
  InterfaceTypes,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import StructuredReportToTextOptions from './StructuredReportToTextOptions.js'
import StructuredReportToTextResult from './StructuredReportToTextResult.js'

/**
 * Read a DICOM structured report file and generate a plain text representation
 *
 * @param {Uint8Array} dicomFile - Input DICOM file
 *
 * @returns {Promise<StructuredReportToTextResult>} - result object
 */
async function structuredReportToText(
  webWorker: null | Worker,
  dicomFile: Uint8Array,
  options: StructuredReportToTextOptions = {})
    : Promise<StructuredReportToTextResult> {

  const desiredOutputs = [
    { type: InterfaceTypes.TextStream },
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
  if (options.unknownRelationship) {
    args.push('--unknown-relationship')
  }
  if (options.invalidItemValue) {
    args.push('--invalid-item-value')
  }
  if (options.ignoreConstraints) {
    args.push('--ignore-constraints')
  }
  if (options.ignoreItemErrors) {
    args.push('--ignore-item-errors')
  }
  if (options.skipInvalidItems) {
    args.push('--skip-invalid-items')
  }
  if (options.noDocumentHeader) {
    args.push('--no-document-header')
  }
  if (options.numberNestedItems) {
    args.push('--number-nested-items')
  }
  if (options.shortenLongValues) {
    args.push('--shorten-long-values')
  }
  if (options.printInstanceUid) {
    args.push('--print-instance-uid')
  }
  if (options.printSopclassShort) {
    args.push('--print-sopclass-short')
  }
  if (options.printSopclassLong) {
    args.push('--print-sopclass-long')
  }
  if (options.printSopclassUid) {
    args.push('--print-sopclass-uid')
  }
  if (options.printAllCodes) {
    args.push('--print-all-codes')
  }
  if (options.printInvalidCodes) {
    args.push('--print-invalid-codes')
  }
  if (options.printTemplateId) {
    args.push('--print-template-id')
  }
  if (options.indicateEnhanced) {
    args.push('--indicate-enhanced')
  }
  if (options.printColor) {
    args.push('--print-color')
  }

  const pipelinePath = 'structured-report-to-text'

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
    outputText: (outputs[0].data as TextStream).data,
  }
  return result
}

export default structuredReportToText
