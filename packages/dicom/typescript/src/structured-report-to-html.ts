// Generated file. Do not edit.

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
  webWorker: null | Worker,
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
  const dicomFileName = dicomFile instanceof File ? dicomFile.name : dicomFile.path
  args.push(dicomFileName as string)
  // Outputs
  const outputTextName = '0'
  args.push(outputTextName)
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
    args.push('--html-32')
  }
  if (typeof options.html40 !== "undefined") {
    args.push('--html-40')
  }
  if (typeof options.xhtml11 !== "undefined") {
    args.push('--xhtml-11')
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

  const pipelinePath = 'structured-report-to-html'

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

export default structuredReportToHtml
