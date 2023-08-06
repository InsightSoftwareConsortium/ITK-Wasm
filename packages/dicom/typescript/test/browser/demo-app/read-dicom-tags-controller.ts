// Generated file. To retain edits, remove this comment.

import * as dicom from '../../../dist/bundles/dicom.js'
import readDicomTagsLoadSampleInputs from "./read-dicom-tags-load-sample-inputs.js"

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
      loadSampleInputsButton.addEventListener('click', (event) => {
        loadSampleInputs(model)
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
        const input = document.querySelector("#readDicomTagsInputs sl-input[name=dicom-file]")
        input.value = model.inputs.get("dicomFile").data.subarray(0, 50).toString() + ' ...'
    })

    // ----------------------------------------------
    // Options
    const tagsToReadElement = document.querySelector('#readDicomTagsInputs input[name=tags-to-read-file]')
    tagsToReadElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const arrayBuffer = await files[0].arrayBuffer()
        model.options.set("tagsToRead", JSON.parse(new TextDecoder().decode(new Uint8Array(arrayBuffer))))
        const details = document.getElementById("tags-to-read-input")
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

        const { webWorker, tags, } = await dicom.readDicomTags(this.webWorker,
          { data: model.inputs.get('dicomFile').data.slice(), path: model.inputs.get('dicomFile').path },
          Object.fromEntries(model.options.entries())
        )

        const t1 = performance.now()
        globalThis.notify("readDicomTags successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")
        this.webWorker = webWorker

        model.outputs.set("tags", tags)
        tagsOutputDownload.variant = "success"
        tagsOutputDownload.disabled = false
        const tagsDetails = document.getElementById("tags-output")
        tagsDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(tags, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        tagsDetails.disabled = false
        const tagsOutput = document.querySelector('#readDicomTagsOutputs sl-details[name=tags]')
      } catch (error) {
        globalThis.notify("Error while running pipeline", error.toString(), "danger", "exclamation-octagon")
        throw error
      } finally {
        runButton.loading = false
      }
    })
  }
}

const readDicomTagsController = new ReadDicomTagsController(readDicomTagsLoadSampleInputs)
