
import { writeImageArrayBuffer } from 'itk-wasm'
import { copyImage } from 'itk-wasm'
import * as imageIo from '../../../dist/index.js'
import mincReadImageLoadSampleInputs, { usePreRun } from "./minc-read-image-load-sample-inputs.js"

class MincReadImageModel {
  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
}


class MincReadImageController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new MincReadImageModel()
    const model = this.model

    this.webWorker = null

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#mincReadImageInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const serializedImageElement = document.querySelector('#mincReadImageInputs input[name=serialized-image-file]')
    serializedImageElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const arrayBuffer = await files[0].arrayBuffer()
        model.inputs.set("serializedImage", { data: new Uint8Array(arrayBuffer), path: files[0].name })
        const details = document.getElementById("mincReadImage-serialized-image-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(model.inputs.get("serializedImage").data.subarray(0, 50).toString() + ' ...')}</pre>`
        details.disabled = false
    })

    // ----------------------------------------------
    // Options
    const informationOnlyElement = document.querySelector('#mincReadImageInputs sl-checkbox[name=information-only]')
    informationOnlyElement.addEventListener('sl-change', (event) => {
        model.options.set("informationOnly", informationOnlyElement.checked)
    })

    // ----------------------------------------------
    // Outputs
    const couldReadOutputDownload = document.querySelector('#mincReadImageOutputs sl-button[name=could-read-download]')
    couldReadOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("couldRead")) {
            const fileName = `couldRead.json`
            globalThis.downloadFile(new TextEncoder().encode(JSON.stringify(model.outputs.get("couldRead"))), fileName)
        }
    })

    const imageOutputDownload = document.querySelector('#mincReadImageOutputs sl-button[name=image-download]')
    imageOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("image")) {
            const imageDownloadFormat = document.getElementById('image-output-format')
            const downloadFormat = imageDownloadFormat.value || 'nrrd'
            const fileName = `image.${downloadFormat}`
            const { webWorker, serializedImage } = await imageIo.writeImage(copyImage(model.outputs.get("image")), fileName)

            webWorker.terminate()
            globalThis.downloadFile(serializedImage, fileName)
        }
    })

    const preRun = async () => {
      if (!this.webWorker && loadSampleInputs && usePreRun) {
        await loadSampleInputs(model, true)
        await this.run()
      }
    }

    const onSelectTab = async (event) => {
      if (event.detail.name === 'mincReadImage-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'mincReadImage') {
          params.set('functionName', 'mincReadImage')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'mincReadImage' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'mincReadImage') {
        tabGroup.show('mincReadImage-panel')
        preRun()
      }
    }
    onInit()

    const runButton = document.querySelector('#mincReadImageInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('serializedImage')) {
        globalThis.notify("Required input not provided", "serializedImage", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true

        const t0 = performance.now()
        const { couldRead, image, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("mincReadImage successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("couldRead", couldRead)
        couldReadOutputDownload.variant = "success"
        couldReadOutputDownload.disabled = false
        const couldReadDetails = document.getElementById("mincReadImage-could-read-details")
        couldReadDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(couldRead, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        couldReadDetails.disabled = false
        const couldReadOutput = document.getElementById("mincReadImage-could-read-details")

        model.outputs.set("image", image)
        imageOutputDownload.variant = "success"
        imageOutputDownload.disabled = false
        const imageDetails = document.getElementById("mincReadImage-image-details")
        imageDetails.setImage(image)
        imageDetails.disabled = false
        
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
    options.webWorker = this.webWorker
    const { webWorker, couldRead, image, } = await imageIo.mincReadImage(
      { data: this.model.inputs.get('serializedImage').data.slice(), path: this.model.inputs.get('serializedImage').path },
      options
    )
    this.webWorker = webWorker

    return { couldRead, image, }
  }
}

const mincReadImageController = new MincReadImageController(mincReadImageLoadSampleInputs)
