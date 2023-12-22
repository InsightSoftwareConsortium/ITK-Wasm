// Generated file. To retain edits, remove this comment.

import {
  BinaryFile,
  TextStream,
  TextFile,
  InterfaceTypes,
  PipelineOutput,
  PipelineInput,
  runPipeline
} from 'itk-wasm'

import StructuredReportToHtmlOptions from './structured-report-to-html-options.js'
import StructuredReportToHtmlResult from './structured-report-to-html-result.js'

import { getPipelinesBaseUrl } from './pipelines-base-url.js'
import { getPipelineWorkerUrl } from './pipeline-worker-url.js'

/**
 * Render DICOM SR file and data set to HTML/XHTML
 *
 * @param {File | BinaryFile} dicomFile - Input DICOM file
 * @param {StructuredReportToHtmlOptions} options - options object
 *
 * @returns {Promise<StructuredReportToHtmlResult>} - result object
 */
async function structuredReportToHtml(
  dicomFile: File | BinaryFile,
  options: StructuredReportToHtmlOptions = {}
) : Promise<StructuredReportToHtmlResult> {

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
  if (typeof options.readFileOnly !== "undefined") {
    options.readFileOnly && args.push('--read-file-only')
  }
  if (typeof options.readDataset !== "undefined") {
    options.readDataset && args.push('--read-dataset')
  }
  if (typeof options.readXferAuto !== "undefined") {
    options.readXferAuto && args.push('--read-xfer-auto')
  }
  if (typeof options.readXferDetect !== "undefined") {
    options.readXferDetect && args.push('--read-xfer-detect')
  }
  if (typeof options.readXferLittle !== "undefined") {
    options.readXferLittle && args.push('--read-xfer-little')
  }
  if (typeof options.readXferBig !== "undefined") {
    options.readXferBig && args.push('--read-xfer-big')
  }
  if (typeof options.readXferImplicit !== "undefined") {
    options.readXferImplicit && args.push('--read-xfer-implicit')
  }
  if (typeof options.processingDetails !== "undefined") {
    options.processingDetails && args.push('--processing-details')
  }
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
  if (typeof options.disableVrChecker !== "undefined") {
    options.disableVrChecker && args.push('--disable-vr-checker')
  }
  if (typeof options.charsetRequire !== "undefined") {
    options.charsetRequire && args.push('--charset-require')
  }
  if (typeof options.charsetAssume !== "undefined") {
    args.push('--charset-assume', options.charsetAssume.toString())

  }
  if (typeof options.charsetCheckAll !== "undefined") {
    options.charsetCheckAll && args.push('--charset-check-all')
  }
  if (typeof options.convertToUtf8 !== "undefined") {
    options.convertToUtf8 && args.push('--convert-to-utf8')
  }
  if (typeof options.urlPrefix !== "undefined") {
    args.push('--url-prefix', options.urlPrefix.toString())

  }
  if (typeof options.html32 !== "undefined") {
    options.html32 && args.push('--html-32')
  }
  if (typeof options.html40 !== "undefined") {
    options.html40 && args.push('--html-40')
  }
  if (typeof options.xhtml11 !== "undefined") {
    options.xhtml11 && args.push('--xhtml-11')
  }
  if (typeof options.addDocumentType !== "undefined") {
    options.addDocumentType && args.push('--add-document-type')
  }
  if (typeof options.cssReference !== "undefined") {
    const inputCountString = inputs.length.toString()
    inputs.push({ type: InterfaceTypes.TextStream, data: { data: options.cssReference } })
    args.push('--css-reference', inputCountString)

  }
  if (typeof options.cssFile !== "undefined") {
    const cssFile = options.cssFile
    let cssFileFile = cssFile
    if (cssFile instanceof File) {
      const cssFileBuffer = await cssFile.arrayBuffer()
      cssFileFile = { path: cssFile.name, data: new TextDecoder().decode(cssFileBuffer) }
    }
    args.push('--css-file')

    inputs.push({ type: InterfaceTypes.TextFile, data: cssFileFile as TextFile })
    const name = cssFile instanceof File ? cssFile.name : (cssFile as TextFile).path
    args.push(name)

  }
  if (typeof options.expandInline !== "undefined") {
    options.expandInline && args.push('--expand-inline')
  }
  if (typeof options.neverExpandInline !== "undefined") {
    options.neverExpandInline && args.push('--never-expand-inline')
  }
  if (typeof options.alwaysExpandInline !== "undefined") {
    options.alwaysExpandInline && args.push('--always-expand-inline')
  }
  if (typeof options.renderFullData !== "undefined") {
    options.renderFullData && args.push('--render-full-data')
  }
  if (typeof options.sectionTitleInline !== "undefined") {
    options.sectionTitleInline && args.push('--section-title-inline')
  }
  if (typeof options.documentTypeTitle !== "undefined") {
    options.documentTypeTitle && args.push('--document-type-title')
  }
  if (typeof options.patientInfoTitle !== "undefined") {
    options.patientInfoTitle && args.push('--patient-info-title')
  }
  if (typeof options.noDocumentHeader !== "undefined") {
    options.noDocumentHeader && args.push('--no-document-header')
  }
  if (typeof options.renderInlineCodes !== "undefined") {
    options.renderInlineCodes && args.push('--render-inline-codes')
  }
  if (typeof options.conceptNameCodes !== "undefined") {
    options.conceptNameCodes && args.push('--concept-name-codes')
  }
  if (typeof options.numericUnitCodes !== "undefined") {
    options.numericUnitCodes && args.push('--numeric-unit-codes')
  }
  if (typeof options.codeValueUnit !== "undefined") {
    options.codeValueUnit && args.push('--code-value-unit')
  }
  if (typeof options.codeMeaningUnit !== "undefined") {
    options.codeMeaningUnit && args.push('--code-meaning-unit')
  }
  if (typeof options.renderAllCodes !== "undefined") {
    options.renderAllCodes && args.push('--render-all-codes')
  }
  if (typeof options.codeDetailsTooltip !== "undefined") {
    options.codeDetailsTooltip && args.push('--code-details-tooltip')
  }

  const pipelinePath = 'structured-report-to-html'

  const {
    webWorker: usedWebWorker,
    returnValue,
    stderr,
    outputs
  } = await runPipeline(pipelinePath, args, desiredOutputs, inputs, { pipelineBaseUrl: getPipelinesBaseUrl(), pipelineWorkerUrl: getPipelineWorkerUrl(), webWorker: options?.webWorker ?? null })
  if (returnValue !== 0 && stderr !== "") {
    throw new Error(stderr)
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    outputText: (outputs[0]?.data as TextStream).data,
  }
  return result
}

export default structuredReportToHtml
