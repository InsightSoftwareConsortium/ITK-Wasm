// Generated file. To retain edits, remove this comment.

import * as dicom from '../../../dist/index.js'
import structuredReportToTextLoadSampleInputs, { usePreRun } from "./structured-report-to-text-load-sample-inputs.js"

class StructuredReportToTextModel {
  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
}


class StructuredReportToTextController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new StructuredReportToTextModel()
    const model = this.model

    this.webWorker = null

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#structuredReportToTextInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const dicomFileElement = document.querySelector('#structuredReportToTextInputs input[name=dicom-file-file]')
    dicomFileElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const arrayBuffer = await files[0].arrayBuffer()
        model.inputs.set("dicomFile", { data: new Uint8Array(arrayBuffer), path: files[0].name })
        const details = document.getElementById("structuredReportToText-dicom-file-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(model.inputs.get("dicomFile").data.subarray(0, 50).toString() + ' ...')}</pre>`
        details.disabled = false
    })

    // ----------------------------------------------
    // Options
    const unknownRelationshipElement = document.querySelector('#structuredReportToTextInputs sl-checkbox[name=unknown-relationship]')
    unknownRelationshipElement.addEventListener('sl-change', (event) => {
        model.options.set("unknownRelationship", unknownRelationshipElement.checked)
    })

    const invalidItemValueElement = document.querySelector('#structuredReportToTextInputs sl-checkbox[name=invalid-item-value]')
    invalidItemValueElement.addEventListener('sl-change', (event) => {
        model.options.set("invalidItemValue", invalidItemValueElement.checked)
    })

    const ignoreConstraintsElement = document.querySelector('#structuredReportToTextInputs sl-checkbox[name=ignore-constraints]')
    ignoreConstraintsElement.addEventListener('sl-change', (event) => {
        model.options.set("ignoreConstraints", ignoreConstraintsElement.checked)
    })

    const ignoreItemErrorsElement = document.querySelector('#structuredReportToTextInputs sl-checkbox[name=ignore-item-errors]')
    ignoreItemErrorsElement.addEventListener('sl-change', (event) => {
        model.options.set("ignoreItemErrors", ignoreItemErrorsElement.checked)
    })

    const skipInvalidItemsElement = document.querySelector('#structuredReportToTextInputs sl-checkbox[name=skip-invalid-items]')
    skipInvalidItemsElement.addEventListener('sl-change', (event) => {
        model.options.set("skipInvalidItems", skipInvalidItemsElement.checked)
    })

    const noDocumentHeaderElement = document.querySelector('#structuredReportToTextInputs sl-checkbox[name=no-document-header]')
    noDocumentHeaderElement.addEventListener('sl-change', (event) => {
        model.options.set("noDocumentHeader", noDocumentHeaderElement.checked)
    })

    const numberNestedItemsElement = document.querySelector('#structuredReportToTextInputs sl-checkbox[name=number-nested-items]')
    numberNestedItemsElement.addEventListener('sl-change', (event) => {
        model.options.set("numberNestedItems", numberNestedItemsElement.checked)
    })

    const shortenLongValuesElement = document.querySelector('#structuredReportToTextInputs sl-checkbox[name=shorten-long-values]')
    shortenLongValuesElement.addEventListener('sl-change', (event) => {
        model.options.set("shortenLongValues", shortenLongValuesElement.checked)
    })

    const printInstanceUidElement = document.querySelector('#structuredReportToTextInputs sl-checkbox[name=print-instance-uid]')
    printInstanceUidElement.addEventListener('sl-change', (event) => {
        model.options.set("printInstanceUid", printInstanceUidElement.checked)
    })

    const printSopclassShortElement = document.querySelector('#structuredReportToTextInputs sl-checkbox[name=print-sopclass-short]')
    printSopclassShortElement.addEventListener('sl-change', (event) => {
        model.options.set("printSopclassShort", printSopclassShortElement.checked)
    })

    const printSopclassLongElement = document.querySelector('#structuredReportToTextInputs sl-checkbox[name=print-sopclass-long]')
    printSopclassLongElement.addEventListener('sl-change', (event) => {
        model.options.set("printSopclassLong", printSopclassLongElement.checked)
    })

    const printSopclassUidElement = document.querySelector('#structuredReportToTextInputs sl-checkbox[name=print-sopclass-uid]')
    printSopclassUidElement.addEventListener('sl-change', (event) => {
        model.options.set("printSopclassUid", printSopclassUidElement.checked)
    })

    const printAllCodesElement = document.querySelector('#structuredReportToTextInputs sl-checkbox[name=print-all-codes]')
    printAllCodesElement.addEventListener('sl-change', (event) => {
        model.options.set("printAllCodes", printAllCodesElement.checked)
    })

    const printInvalidCodesElement = document.querySelector('#structuredReportToTextInputs sl-checkbox[name=print-invalid-codes]')
    printInvalidCodesElement.addEventListener('sl-change', (event) => {
        model.options.set("printInvalidCodes", printInvalidCodesElement.checked)
    })

    const printTemplateIdElement = document.querySelector('#structuredReportToTextInputs sl-checkbox[name=print-template-id]')
    printTemplateIdElement.addEventListener('sl-change', (event) => {
        model.options.set("printTemplateId", printTemplateIdElement.checked)
    })

    const indicateEnhancedElement = document.querySelector('#structuredReportToTextInputs sl-checkbox[name=indicate-enhanced]')
    indicateEnhancedElement.addEventListener('sl-change', (event) => {
        model.options.set("indicateEnhanced", indicateEnhancedElement.checked)
    })

    const printColorElement = document.querySelector('#structuredReportToTextInputs sl-checkbox[name=print-color]')
    printColorElement.addEventListener('sl-change', (event) => {
        model.options.set("printColor", printColorElement.checked)
    })

    // ----------------------------------------------
    // Outputs
    const outputTextOutputDownload = document.querySelector('#structuredReportToTextOutputs sl-button[name=output-text-download]')
    outputTextOutputDownload.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("outputText")) {
            globalThis.downloadFile(new TextEncoder().encode(model.outputs.get("outputText")), "outputText.txt")
        }
    })

    const preRun = async () => {
      if (!this.webWorker && loadSampleInputs && usePreRun) {
        await loadSampleInputs(model, true)
        await this.run()
      }
    }

    const onSelectTab = async (event) => {
      if (event.detail.name === 'structuredReportToText-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'structuredReportToText') {
          params.set('functionName', 'structuredReportToText')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'structuredReportToText' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'structuredReportToText') {
        tabGroup.show('structuredReportToText-panel')
        preRun()
      }
    }
    onInit()

    const runButton = document.querySelector('#structuredReportToTextInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('dicomFile')) {
        globalThis.notify("Required input not provided", "dicomFile", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true

        const t0 = performance.now()
        const { outputText, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("structuredReportToText successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("outputText", outputText)
        outputTextOutputDownload.variant = "success"
        outputTextOutputDownload.disabled = false
        const outputTextOutput = document.getElementById("structuredReportToText-output-text-details")
        outputTextOutput.innerHTML = `<pre>${globalThis.escapeHtml(outputText.substring(0, 1024).toString() + ' ...')}</pre>`
        outputTextOutput.disabled = false
      } catch (error) {
        globalThis.notify("Error while running pipeline", error.toString(), "danger", "exclamation-octagon")
        throw error
      } finally {
        runButton.loading = false
      }
    })
  }

  async run() {
    const { webWorker, outputText, } = await dicom.structuredReportToText(this.webWorker,
      { data: this.model.inputs.get('dicomFile').data.slice(), path: this.model.inputs.get('dicomFile').path },
      Object.fromEntries(this.model.options.entries())
    )
    this.webWorker = webWorker

    return { outputText, }
  }
}

const structuredReportToTextController = new StructuredReportToTextController(structuredReportToTextLoadSampleInputs)
