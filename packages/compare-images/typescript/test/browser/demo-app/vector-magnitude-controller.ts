// Generated file. To retain edits, remove this comment.

import { readImageFile } from 'itk-wasm'
import { writeImageArrayBuffer, copyImage } from 'itk-wasm'
import * as compareImages from '../../../dist/bundles/compare-images.js'
import vectorMagnitudeLoadSampleInputs from "./vector-magnitude-load-sample-inputs.js"

class VectorMagnitudeModel {

  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
  }


class VectorMagnitudeController  {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new VectorMagnitudeModel()
    const model = this.model

    this.webWorker = null

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#vectorMagnitudeInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const vectorImageElement = document.querySelector('#vectorMagnitudeInputs input[name=vector-image-file]')
    vectorImageElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const { image, webWorker } = await readImageFile(null, files[0])
        webWorker.terminate()
        model.inputs.set("vectorImage", image)
        const details = document.getElementById("vectorMagnitude-vector-image-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(image, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        details.disabled = false
    })

    // ----------------------------------------------
    // Options
    // ----------------------------------------------
    // Outputs
    const magnitudeImageOutputDownload = document.querySelector('#vectorMagnitudeOutputs sl-button[name=magnitude-image-download]')
    magnitudeImageOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("magnitudeImage")) {
            const magnitudeImageDownloadFormat = document.getElementById('magnitude-image-output-format')
            const downloadFormat = magnitudeImageDownloadFormat.value || 'nrrd'
            const fileName = `magnitudeImage.${downloadFormat}`
            const { webWorker, arrayBuffer } = await writeImageArrayBuffer(null, copyImage(model.outputs.get("magnitudeImage")), fileName)

            webWorker.terminate()
            globalThis.downloadFile(arrayBuffer, fileName)
        }
    })

    const runButton = document.querySelector('#vectorMagnitudeInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('vectorImage')) {
        globalThis.notify("Required input not provided", "vectorImage", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true
        const t0 = performance.now()

        const { webWorker, magnitudeImage, } = await compareImages.vectorMagnitude(this.webWorker,
          model.inputs.get('vectorImage'),
          Object.fromEntries(model.options.entries())
        )

        const t1 = performance.now()
        globalThis.notify("vectorMagnitude successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")
        this.webWorker = webWorker

        model.outputs.set("magnitudeImage", magnitudeImage)
        magnitudeImageOutputDownload.variant = "success"
        magnitudeImageOutputDownload.disabled = false
        const magnitudeImageDetails = document.getElementById("vectorMagnitude-magnitude-image-details")
        magnitudeImageDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(magnitudeImage, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        magnitudeImageDetails.disabled = false
        const magnitudeImageOutput = document.getElementById('vectorMagnitude-magnitude-image-details')
      } catch (error) {
        globalThis.notify("Error while running pipeline", error.toString(), "danger", "exclamation-octagon")
        throw error
      } finally {
        runButton.loading = false
      }
    })
  }
}

const vectorMagnitudeController = new VectorMagnitudeController(vectorMagnitudeLoadSampleInputs)
