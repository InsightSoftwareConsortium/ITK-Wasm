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

import { getDefaultWebWorker } from './default-web-worker.js'

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

  const pipelinePath = 'structured-report-to-html'

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

export default structuredReportToHtml
