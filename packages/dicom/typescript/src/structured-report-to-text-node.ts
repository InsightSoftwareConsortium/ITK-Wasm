// Generated file. To retain edits, remove this comment.

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
 * @param {string} dicomFile - Input DICOM file
 * @param {StructuredReportToTextOptions} options - options object
 *
 * @returns {Promise<StructuredReportToTextNodeResult>} - result object
 */
async function structuredReportToTextNode(
  dicomFile: string,
  options: StructuredReportToTextOptions = {}
) : Promise<StructuredReportToTextNodeResult> {

  const mountDirs: Set<string> = new Set()

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.TextStream },
  ]
  mountDirs.add(path.dirname(dicomFile as string))
  const inputs: Array<PipelineInput> = [
  ]

  const args = []
  // ----------------------------------------------
  // Inputs

  const dicomFileName = dicomFile
  args.push(dicomFileName as string)
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

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), '..', 'pipelines', 'structured-report-to-text')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs, mountDirs)
  if (returnValue !== 0) {
    throw new Error(stderr)
  }

  const result = {
    outputText: (outputs[0].data as TextStream).data,
  }
  return result
}

export default structuredReportToTextNode
