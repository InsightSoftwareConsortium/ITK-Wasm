// Generated file. To retain edits, remove this comment.

import { readImage } from '@itk-wasm/image-io'
import { writeImage } from '@itk-wasm/image-io'
import * as compareImages from '../../../dist/index.js'
import vectorMagnitudeLoadSampleInputs, { usePreRun } from "./vector-magnitude-load-sample-inputs.js"

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


class VectorMagnitudeController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new VectorMagnitudeModel()
    const model = this.model

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

        const { image, webWorker } = await readImage(files[0])
        webWorker.terminate()
        model.inputs.set("vectorImage", image)
        const details = document.getElementById("vectorMagnitude-vector-image-details")
        details.setImage(image)
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
            const magnitudeImageDownloadFormat = document.getElementById('vectorMagnitude-magnitude-image-output-format')
            const downloadFormat = magnitudeImageDownloadFormat.value || 'nrrd'
            const fileName = `magnitudeImage.${downloadFormat}`
            const { webWorker, serializedImage } = await writeImage(model.outputs.get("magnitudeImage"), fileName)

            webWorker.terminate()
            globalThis.downloadFile(serializedImage.data, fileName)
        }
    })

    const preRun = async () => {
      if (loadSampleInputs && usePreRun) {
        await loadSampleInputs(model, true)
        await this.run()
      }
    }

    const onSelectTab = async (event) => {
      if (event.detail.name === 'vectorMagnitude-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'vectorMagnitude') {
          params.set('functionName', 'vectorMagnitude')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'vectorMagnitude' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'vectorMagnitude') {
        tabGroup.show('vectorMagnitude-panel')
        preRun()
      }
    }
    onInit()

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
        const { magnitudeImage, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("vectorMagnitude successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("magnitudeImage", magnitudeImage)
        magnitudeImageOutputDownload.variant = "success"
        magnitudeImageOutputDownload.disabled = false
        const magnitudeImageDetails = document.getElementById("vectorMagnitude-magnitude-image-details")
        magnitudeImageDetails.disabled = false
        magnitudeImageDetails.setImage(magnitudeImage)
      } catch (error) {
        globalThis.notify("Error while running pipeline", error.toString(), "danger", "exclamation-octagon")
        throw error
      } finally {
        runButton.loading = false
      }
    })
  }

  async run() {
    const options = Object.fromEntries(this.model.options.entries())
    const { magnitudeImage, } = await compareImages.vectorMagnitude(      this.model.inputs.get('vectorImage'),
      Object.fromEntries(this.model.options.entries())
    )

    return { magnitudeImage, }
  }
}

const vectorMagnitudeController = new VectorMagnitudeController(vectorMagnitudeLoadSampleInputs)
