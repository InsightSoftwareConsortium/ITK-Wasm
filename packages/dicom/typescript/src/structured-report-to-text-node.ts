// Generated file. To retain edits, remove this comment.

import {
  TextStream,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import StructuredReportToTextNodeOptions from './structured-report-to-text-node-options.js'
import StructuredReportToTextNodeResult from './structured-report-to-text-node-result.js'

import path from 'path'

/**
 * Read a DICOM structured report file and generate a plain text representation
 *
 * @param {string} dicomFile - Input DICOM file
 * @param {StructuredReportToTextNodeOptions} options - options object
 *
 * @returns {Promise<StructuredReportToTextNodeResult>} - result object
 */
async function structuredReportToTextNode(
  dicomFile: string,
  options: StructuredReportToTextNodeOptions = {}
) : Promise<StructuredReportToTextNodeResult> {

  const mountDirs: Set<string> = new Set()

  const desiredOutputs: Array<PipelineOutput> = [
    { type: InterfaceTypes.TextStream },
  ]

  mountDirs.add(path.dirname(dicomFile as string))
  const inputs: Array<PipelineInput> = [
  ]

  const args = []
  // Inputs
  const dicomFileName = dicomFile
  args.push(dicomFileName)
  mountDirs.add(path.dirname(dicomFileName))

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

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), 'pipelines', 'structured-report-to-text')

  const {
    returnValue,
    stderr,
    outputs
  } = await runPipelineNode(pipelinePath, args, desiredOutputs, inputs, mountDirs)
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    outputText: (outputs[0]?.data as TextStream).data,
  }
  return result
}

export default structuredReportToTextNode
