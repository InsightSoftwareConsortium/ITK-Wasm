import {
  TextStream,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import StructuredReportToTextOptions from './structured-report-to-text-options.js'
import StructuredReportToTextNodeResult from './structured-report-to-text-node-result.js'


import path from 'path'

/**
 * Read a DICOM structured report file and generate a plain text representation
 *
 * @param {Uint8Array} dicomFile - Input DICOM file
 *
 * @returns {Promise<StructuredReportToTextNodeResult>} - result object
 */
async function structuredReportToTextNode(
  dicomFile: Uint8Array,
  options: StructuredReportToTextOptions = {}
) : Promise<StructuredReportToTextNodeResult> {

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.TextStream },
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

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), '..', 'pipelines', 'structured-report-to-text')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs)
  if (returnValue !== 0) {
    throw new Error(stderr)
  }

  const result = {
    outputText: (outputs[0].data as TextStream).data,
  }
  return result
}

export default structuredReportToTextNode
