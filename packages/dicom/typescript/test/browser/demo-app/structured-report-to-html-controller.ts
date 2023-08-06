import * as dicom from '../../../dist/bundles/dicom.js'
import structuredReportToHtmlLoadSampleInputs from "./structured-report-to-html-load-sample-inputs.js"

class StructuredReportToHtmlModel {

  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
  }


class StructuredReportToHtmlController  {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new StructuredReportToHtmlModel()
    const model = this.model

    this.webWorker = null

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#structuredReportToHtmlInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', (event) => {
        loadSampleInputs(model)
      })
    }

    // ----------------------------------------------
    // Inputs
    const dicomFileElement = document.querySelector('#structuredReportToHtmlInputs input[name=dicom-file-file]')
    dicomFileElement.addEventListener('change', (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        files[0].arrayBuffer().then((arrayBuffer) => {
            model.inputs.set("dicomFile", { data: new Uint8Array(arrayBuffer), path: files[0].name })
            const input = document.querySelector("#structuredReportToHtmlInputs sl-input[name=dicom-file]")
            input.value = model.inputs.get("dicomFile").data.subarray(0, 50).toString() + ' ...'
        })
    })

    // ----------------------------------------------
    // Options
    const readFileOnlyElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=read-file-only]')
    readFileOnlyElement.addEventListener('sl-change', (event) => {
        model.options.set("readFileOnly", readFileOnlyElement.checked)
    })

    const readDatasetElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=read-dataset]')
    readDatasetElement.addEventListener('sl-change', (event) => {
        model.options.set("readDataset", readDatasetElement.checked)
    })

    const readXferAutoElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=read-xfer-auto]')
    readXferAutoElement.addEventListener('sl-change', (event) => {
        model.options.set("readXferAuto", readXferAutoElement.checked)
    })

    const readXferDetectElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=read-xfer-detect]')
    readXferDetectElement.addEventListener('sl-change', (event) => {
        model.options.set("readXferDetect", readXferDetectElement.checked)
    })

    const readXferLittleElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=read-xfer-little]')
    readXferLittleElement.addEventListener('sl-change', (event) => {
        model.options.set("readXferLittle", readXferLittleElement.checked)
    })

    const readXferBigElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=read-xfer-big]')
    readXferBigElement.addEventListener('sl-change', (event) => {
        model.options.set("readXferBig", readXferBigElement.checked)
    })

    const readXferImplicitElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=read-xfer-implicit]')
    readXferImplicitElement.addEventListener('sl-change', (event) => {
        model.options.set("readXferImplicit", readXferImplicitElement.checked)
    })

    const processingDetailsElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=processing-details]')
    processingDetailsElement.addEventListener('sl-change', (event) => {
        model.options.set("processingDetails", processingDetailsElement.checked)
    })

    const unknownRelationshipElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=unknown-relationship]')
    unknownRelationshipElement.addEventListener('sl-change', (event) => {
        model.options.set("unknownRelationship", unknownRelationshipElement.checked)
    })

    const invalidItemValueElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=invalid-item-value]')
    invalidItemValueElement.addEventListener('sl-change', (event) => {
        model.options.set("invalidItemValue", invalidItemValueElement.checked)
    })

    const ignoreConstraintsElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=ignore-constraints]')
    ignoreConstraintsElement.addEventListener('sl-change', (event) => {
        model.options.set("ignoreConstraints", ignoreConstraintsElement.checked)
    })

    const ignoreItemErrorsElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=ignore-item-errors]')
    ignoreItemErrorsElement.addEventListener('sl-change', (event) => {
        model.options.set("ignoreItemErrors", ignoreItemErrorsElement.checked)
    })

    const skipInvalidItemsElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=skip-invalid-items]')
    skipInvalidItemsElement.addEventListener('sl-change', (event) => {
        model.options.set("skipInvalidItems", skipInvalidItemsElement.checked)
    })

    const disableVrCheckerElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=disable-vr-checker]')
    disableVrCheckerElement.addEventListener('sl-change', (event) => {
        model.options.set("disableVrChecker", disableVrCheckerElement.checked)
    })

    const charsetRequireElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=charset-require]')
    charsetRequireElement.addEventListener('sl-change', (event) => {
        model.options.set("charsetRequire", charsetRequireElement.checked)
    })

    const charsetAssumeElement = document.querySelector('#structuredReportToHtmlInputs sl-input[name=charset-assume]')
    charsetAssumeElement.addEventListener('sl-change', (event) => {
        model.options.set("charsetAssume", charsetAssumeElement.value)
    })

    const charsetCheckAllElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=charset-check-all]')
    charsetCheckAllElement.addEventListener('sl-change', (event) => {
        model.options.set("charsetCheckAll", charsetCheckAllElement.checked)
    })

    const convertToUtf8Element = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=convert-to-utf8]')
    convertToUtf8Element.addEventListener('sl-change', (event) => {
        model.options.set("convertToUtf8", convertToUtf8Element.checked)
    })

    const urlPrefixElement = document.querySelector('#structuredReportToHtmlInputs sl-input[name=url-prefix]')
    urlPrefixElement.addEventListener('sl-change', (event) => {
        model.options.set("urlPrefix", urlPrefixElement.value)
    })

    const html32Element = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=html-32]')
    html32Element.addEventListener('sl-change', (event) => {
        model.options.set("html32", html32Element.checked)
    })

    const html40Element = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=html-40]')
    html40Element.addEventListener('sl-change', (event) => {
        model.options.set("html40", html40Element.checked)
    })

    const xhtml11Element = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=xhtml-11]')
    xhtml11Element.addEventListener('sl-change', (event) => {
        model.options.set("xhtml11", xhtml11Element.checked)
    })

    const addDocumentTypeElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=add-document-type]')
    addDocumentTypeElement.addEventListener('sl-change', (event) => {
        model.options.set("addDocumentType", addDocumentTypeElement.checked)
    })

    const cssReferenceElement = document.querySelector('#structuredReportToHtmlInputs input[name=css-reference-file]')
    cssReferenceElement.addEventListener('change', (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        files[0].arrayBuffer().then((arrayBuffer) => {
            model.options.set("cssReference", new TextDecoder().decode(new Uint8Array(arrayBuffer)))
            const input = document.querySelector("#structuredReportToHtmlInputs sl-input[name=css-reference]")
            input.value = model.options.get("cssReference").data.substring(0, 50) + ' ...'
        })
    })

    const cssFileElement = document.querySelector('#structuredReportToHtmlInputs input[name=css-file-file]')
    cssFileElement.addEventListener('change', (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        files[0].arrayBuffer().then((arrayBuffer) => {
            model.options.set("cssFile", { data: new TextDecoder().decode(new Uint8Array(arrayBuffer)), path: files[0].name })
            const input = document.querySelector("#structuredReportToHtmlInputs sl-input[name=css-file]")
            input.value = model.options.get("cssFile").data.substring(0, 50) + ' ...'
        })
    })

    const expandInlineElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=expand-inline]')
    expandInlineElement.addEventListener('sl-change', (event) => {
        model.options.set("expandInline", expandInlineElement.checked)
    })

    const neverExpandInlineElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=never-expand-inline]')
    neverExpandInlineElement.addEventListener('sl-change', (event) => {
        model.options.set("neverExpandInline", neverExpandInlineElement.checked)
    })

    const alwaysExpandInlineElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=always-expand-inline]')
    alwaysExpandInlineElement.addEventListener('sl-change', (event) => {
        model.options.set("alwaysExpandInline", alwaysExpandInlineElement.checked)
    })

    const renderFullDataElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=render-full-data]')
    renderFullDataElement.addEventListener('sl-change', (event) => {
        model.options.set("renderFullData", renderFullDataElement.checked)
    })

    const sectionTitleInlineElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=section-title-inline]')
    sectionTitleInlineElement.addEventListener('sl-change', (event) => {
        model.options.set("sectionTitleInline", sectionTitleInlineElement.checked)
    })

    const documentTypeTitleElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=document-type-title]')
    documentTypeTitleElement.addEventListener('sl-change', (event) => {
        model.options.set("documentTypeTitle", documentTypeTitleElement.checked)
    })

    const patientInfoTitleElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=patient-info-title]')
    patientInfoTitleElement.addEventListener('sl-change', (event) => {
        model.options.set("patientInfoTitle", patientInfoTitleElement.checked)
    })

    const noDocumentHeaderElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=no-document-header]')
    noDocumentHeaderElement.addEventListener('sl-change', (event) => {
        model.options.set("noDocumentHeader", noDocumentHeaderElement.checked)
    })

    const renderInlineCodesElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=render-inline-codes]')
    renderInlineCodesElement.addEventListener('sl-change', (event) => {
        model.options.set("renderInlineCodes", renderInlineCodesElement.checked)
    })

    const conceptNameCodesElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=concept-name-codes]')
    conceptNameCodesElement.addEventListener('sl-change', (event) => {
        model.options.set("conceptNameCodes", conceptNameCodesElement.checked)
    })

    const numericUnitCodesElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=numeric-unit-codes]')
    numericUnitCodesElement.addEventListener('sl-change', (event) => {
        model.options.set("numericUnitCodes", numericUnitCodesElement.checked)
    })

    const codeValueUnitElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=code-value-unit]')
    codeValueUnitElement.addEventListener('sl-change', (event) => {
        model.options.set("codeValueUnit", codeValueUnitElement.checked)
    })

    const codeMeaningUnitElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=code-meaning-unit]')
    codeMeaningUnitElement.addEventListener('sl-change', (event) => {
        model.options.set("codeMeaningUnit", codeMeaningUnitElement.checked)
    })

    const renderAllCodesElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=render-all-codes]')
    renderAllCodesElement.addEventListener('sl-change', (event) => {
        model.options.set("renderAllCodes", renderAllCodesElement.checked)
    })

    const codeDetailsTooltipElement = document.querySelector('#structuredReportToHtmlInputs sl-checkbox[name=code-details-tooltip]')
    codeDetailsTooltipElement.addEventListener('sl-change', (event) => {
        model.options.set("codeDetailsTooltip", codeDetailsTooltipElement.checked)
    })

    // ----------------------------------------------
    // Outputs
    const outputTextOutputDownload = document.querySelector('#structuredReportToHtmlOutputs sl-button[name=output-text-download]')
    outputTextOutputDownload.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("outputText")) {
            globalThis.downloadFile(new TextEncoder().encode(model.outputs.get("outputText")), "outputText.txt")
        }
    })

    // Begin customization
    const srToHtmlOutputs = document.getElementById('structuredReportToHtmlOutputs')
    const htmlOutputDetails = document.createElement('sl-details')
    htmlOutputDetails.summary = "Output html"
    htmlOutputDetails.disabled = true
    srToHtmlOutputs?.replaceChild(htmlOutputDetails, srToHtmlOutputs?.firstElementChild)
    htmlOutputDetails.id = 'html-output-details'
    // End customization

    const runButton = document.querySelector('#structuredReportToHtmlInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('dicomFile')) {
        globalThis.notify("Required input not provided", "dicomFile", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true
        const t0 = performance.now()

        const { webWorker, outputText, } = await dicom.structuredReportToHtml(this.webWorker,
          { data: model.inputs.get('dicomFile').data.slice(), path: model.inputs.get('dicomFile').path },
          Object.fromEntries(model.options.entries())
        )

        const t1 = performance.now()
        globalThis.notify("structuredReportToHtml successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")
        this.webWorker = webWorker

        model.outputs.set("outputText", outputText)
        outputTextOutputDownload.variant = "success"
        outputTextOutputDownload.disabled = false

        // Begin customization
        const iframe = document.createElement('iframe')
        iframe.srcdoc = outputText
        iframe.title = "Structured report html"
        iframe.width = "100%"
        iframe.height = "500px"
        htmlOutputDetails.replaceChildren(iframe)
        htmlOutputDetails.disabled = false
        htmlOutputDetails.open = true
        // End customization
      } catch (error) {
        globalThis.notify("Error while running pipeline", error.toString(), "danger", "exclamation-octagon")
        throw error
      } finally {
        runButton.loading = false
      }
    })
  }
}

const structuredReportToHtmlController = new StructuredReportToHtmlController(structuredReportToHtmlLoadSampleInputs)
