// Generated file. To retain edits, remove this comment.

import {
  TextStream,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import StructuredReportToHtmlNodeOptions from './structured-report-to-html-node-options.js'
import StructuredReportToHtmlNodeResult from './structured-report-to-html-node-result.js'

import path from 'path'

/**
 * Render DICOM SR file and data set to HTML/XHTML
 *
 * @param {string} dicomFile - Input DICOM file
 * @param {StructuredReportToHtmlNodeOptions} options - options object
 *
 * @returns {Promise<StructuredReportToHtmlNodeResult>} - result object
 */
async function structuredReportToHtmlNode(
  dicomFile: string,
  options: StructuredReportToHtmlNodeOptions = {}
) : Promise<StructuredReportToHtmlNodeResult> {

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
  if (options.processingDetails) {
    options.processingDetails && args.push('--processing-details')
  }
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
  if (options.disableVrChecker) {
    options.disableVrChecker && args.push('--disable-vr-checker')
  }
  if (options.charsetRequire) {
    options.charsetRequire && args.push('--charset-require')
  }
  if (options.charsetAssume) {
    args.push('--charset-assume', options.charsetAssume.toString())

  }
  if (options.charsetCheckAll) {
    options.charsetCheckAll && args.push('--charset-check-all')
  }
  if (options.convertToUtf8) {
    options.convertToUtf8 && args.push('--convert-to-utf8')
  }
  if (options.urlPrefix) {
    args.push('--url-prefix', options.urlPrefix.toString())

  }
  if (options.html32) {
    options.html32 && args.push('--html-32')
  }
  if (options.html40) {
    options.html40 && args.push('--html-40')
  }
  if (options.xhtml11) {
    options.xhtml11 && args.push('--xhtml-11')
  }
  if (options.addDocumentType) {
    options.addDocumentType && args.push('--add-document-type')
  }
  if (options.cssReference) {
    const inputCountString = inputs.length.toString()
    inputs.push({ type: InterfaceTypes.TextStream, data: { data: options.cssReference } })
    args.push('--css-reference', inputCountString)

  }
  if (options.cssFile) {
    const cssFile = options.cssFile
    mountDirs.add(path.dirname(cssFile as string))
    args.push('--css-file')

    const name = cssFile as string
    args.push(name)

  }
  if (options.expandInline) {
    options.expandInline && args.push('--expand-inline')
  }
  if (options.neverExpandInline) {
    options.neverExpandInline && args.push('--never-expand-inline')
  }
  if (options.alwaysExpandInline) {
    options.alwaysExpandInline && args.push('--always-expand-inline')
  }
  if (options.renderFullData) {
    options.renderFullData && args.push('--render-full-data')
  }
  if (options.sectionTitleInline) {
    options.sectionTitleInline && args.push('--section-title-inline')
  }
  if (options.documentTypeTitle) {
    options.documentTypeTitle && args.push('--document-type-title')
  }
  if (options.patientInfoTitle) {
    options.patientInfoTitle && args.push('--patient-info-title')
  }
  if (options.noDocumentHeader) {
    options.noDocumentHeader && args.push('--no-document-header')
  }
  if (options.renderInlineCodes) {
    options.renderInlineCodes && args.push('--render-inline-codes')
  }
  if (options.conceptNameCodes) {
    options.conceptNameCodes && args.push('--concept-name-codes')
  }
  if (options.numericUnitCodes) {
    options.numericUnitCodes && args.push('--numeric-unit-codes')
  }
  if (options.codeValueUnit) {
    options.codeValueUnit && args.push('--code-value-unit')
  }
  if (options.codeMeaningUnit) {
    options.codeMeaningUnit && args.push('--code-meaning-unit')
  }
  if (options.renderAllCodes) {
    options.renderAllCodes && args.push('--render-all-codes')
  }
  if (options.codeDetailsTooltip) {
    options.codeDetailsTooltip && args.push('--code-details-tooltip')
  }

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), 'pipelines', 'structured-report-to-html')

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

export default structuredReportToHtmlNode
