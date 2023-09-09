// Generated file. To retain edits, remove this comment.

import * as dicom from '../../../dist/bundles/dicom.js'
import readDicomTagsLoadSampleInputs, { usePreRun } from "./read-dicom-tags-load-sample-inputs.js"

class ReadDicomTagsModel {

  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
  }


class ReadDicomTagsController  {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new ReadDicomTagsModel()
    const model = this.model

    this.webWorker = null

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#readDicomTagsInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const dicomFileElement = document.querySelector('#readDicomTagsInputs input[name=dicom-file-file]')
    dicomFileElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const arrayBuffer = await files[0].arrayBuffer()
        model.inputs.set("dicomFile", { data: new Uint8Array(arrayBuffer), path: files[0].name })
        const details = document.getElementById("readDicomTags-dicom-file-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(model.inputs.get("dicomFile").data.subarray(0, 50).toString() + ' ...')}</pre>`
        details.disabled = false
    })

    // ----------------------------------------------
    // Options
    const tagsToReadElement = document.querySelector('#readDicomTagsInputs input[name=tags-to-read-file]')
    tagsToReadElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const arrayBuffer = await files[0].arrayBuffer()
        model.options.set("tagsToRead", JSON.parse(new TextDecoder().decode(new Uint8Array(arrayBuffer))))
        const details = document.getElementById("readDicomTags-tags-to-read-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(model.options.get("tagsToRead"), globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        details.disabled = false
    })

    // ----------------------------------------------
    // Outputs
    const tagsOutputDownload = document.querySelector('#readDicomTagsOutputs sl-button[name=tags-download]')
    tagsOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("tags")) {
            const fileName = `tags.json`
            globalThis.downloadFile(new TextEncoder().encode(JSON.stringify(model.outputs.get("tags"))), fileName)
        }
    })

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', async (event) => {
      if (event.detail.name === 'readDicomTags-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'readDicomTags') {
          params.set('functionName', 'readDicomTags')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'readDicomTags' }, '', url)
        }
        if (!this.webWorker && loadSampleInputs && usePreRun) {
          await loadSampleInputs(model, true)
          await this.run()
        }
      }
    })

    const runButton = document.querySelector('#readDicomTagsInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('dicomFile')) {
        globalThis.notify("Required input not provided", "dicomFile", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true

        const t0 = performance.now()
        const { tags, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("readDicomTags successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("tags", tags)
        tagsOutputDownload.variant = "success"
        tagsOutputDownload.disabled = false
        const tagsDetails = document.getElementById("readDicomTags-tags-details")
        tagsDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(tags, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        tagsDetails.disabled = false
        const tagsOutput = document.getElementById("readDicomTags-tags-details")
      } catch (error) {
        globalThis.notify("Error while running pipeline", error.toString(), "danger", "exclamation-octagon")
        throw error
      } finally {
        runButton.loading = false
      }
    })
  }

  async run() {
    const { webWorker, tags, } = await dicom.readDicomTags(this.webWorker,
      { data: this.model.inputs.get('dicomFile').data.slice(), path: this.model.inputs.get('dicomFile').path },
      Object.fromEntries(this.model.options.entries())
    )
    this.webWorker = webWorker

    return { tags, }
  }
}

const readDicomTagsController = new ReadDicomTagsController(readDicomTagsLoadSampleInputs)
