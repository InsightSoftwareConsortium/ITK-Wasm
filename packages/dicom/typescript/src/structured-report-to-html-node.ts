import {
  TextStream,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipelineNode
} from 'itk-wasm'

import StructuredReportToHtmlOptions from './structured-report-to-html-options.js'
import StructuredReportToHtmlNodeResult from './structured-report-to-html-node-result.js'


import path from 'path'

/**
 * Render DICOM SR file and data set to HTML/XHTML
 *
 * @param {Uint8Array} dicomFile - Input DICOM file
 *
 * @returns {Promise<StructuredReportToHtmlNodeResult>} - result object
 */
async function structuredReportToHtmlNode(
  dicomFile: Uint8Array,
  options: StructuredReportToHtmlOptions = {}
) : Promise<StructuredReportToHtmlNodeResult> {

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
  if (typeof options.processingDetails !== "undefined") {
    args.push('--processing-details')
  }
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
  if (typeof options.disableVrChecker !== "undefined") {
    args.push('--disable-vr-checker')
  }
  if (typeof options.charsetRequire !== "undefined") {
    args.push('--charset-require')
  }
  if (typeof options.charsetAssume !== "undefined") {
    args.push('--charset-assume', options.charsetAssume.toString())
  }
  if (typeof options.charsetCheckAll !== "undefined") {
    args.push('--charset-check-all')
  }
  if (typeof options.convertToUtf8 !== "undefined") {
    args.push('--convert-to-utf8')
  }
  if (typeof options.urlPrefix !== "undefined") {
    args.push('--url-prefix', options.urlPrefix.toString())
  }
  if (typeof options.html32 !== "undefined") {
    args.push('--html-3.2')
  }
  if (typeof options.html40 !== "undefined") {
    args.push('--html-4.0')
  }
  if (typeof options.xhtml11 !== "undefined") {
    args.push('--xhtml-1.1')
  }
  if (typeof options.addDocumentType !== "undefined") {
    args.push('--add-document-type')
  }
  if (typeof options.cssReference !== "undefined") {
    const inputCountString = inputs.length.toString()
    inputs.push({ type: InterfaceTypes.TextStream, data: { data: options.cssReference } })
    args.push('--css-reference', inputCountString)
  }
  if (typeof options.cssFile !== "undefined") {
    const inputFile = 'file' + inputs.length.toString()
    inputs.push({ type: InterfaceTypes.TextFile, data: { data: options.cssFile, path: inputFile } })
    args.push('--css-file', inputFile)
  }
  if (typeof options.expandInline !== "undefined") {
    args.push('--expand-inline')
  }
  if (typeof options.neverExpandInline !== "undefined") {
    args.push('--never-expand-inline')
  }
  if (typeof options.alwaysExpandInline !== "undefined") {
    args.push('--always-expand-inline')
  }
  if (typeof options.renderFullData !== "undefined") {
    args.push('--render-full-data')
  }
  if (typeof options.sectionTitleInline !== "undefined") {
    args.push('--section-title-inline')
  }
  if (typeof options.documentTypeTitle !== "undefined") {
    args.push('--document-type-title')
  }
  if (typeof options.patientInfoTitle !== "undefined") {
    args.push('--patient-info-title')
  }
  if (typeof options.noDocumentHeader !== "undefined") {
    args.push('--no-document-header')
  }
  if (typeof options.renderInlineCodes !== "undefined") {
    args.push('--render-inline-codes')
  }
  if (typeof options.conceptNameCodes !== "undefined") {
    args.push('--concept-name-codes')
  }
  if (typeof options.numericUnitCodes !== "undefined") {
    args.push('--numeric-unit-codes')
  }
  if (typeof options.codeValueUnit !== "undefined") {
    args.push('--code-value-unit')
  }
  if (typeof options.codeMeaningUnit !== "undefined") {
    args.push('--code-meaning-unit')
  }
  if (typeof options.renderAllCodes !== "undefined") {
    args.push('--render-all-codes')
  }
  if (typeof options.codeDetailsTooltip !== "undefined") {
    args.push('--code-details-tooltip')
  }

  const pipelinePath = path.join(path.dirname(import.meta.url.substring(7)), '..', 'pipelines', 'structured-report-to-html')

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

export default structuredReportToHtmlNode
