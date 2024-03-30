// Generated file. To retain edits, remove this comment.

import { writeImage } from '@itk-wasm/image-io'
import * as dicom from '../../../dist/index.js'
import applyPresentationStateToImageLoadSampleInputs, { usePreRun } from "./apply-presentation-state-to-image-load-sample-inputs.js"

class ApplyPresentationStateToImageModel {
  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
}


class ApplyPresentationStateToImageController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new ApplyPresentationStateToImageModel()
    const model = this.model

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#applyPresentationStateToImageInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const imageInElement = document.querySelector('#applyPresentationStateToImageInputs input[name=image-in-file]')
    imageInElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const arrayBuffer = await files[0].arrayBuffer()
        model.inputs.set("imageIn", { data: new Uint8Array(arrayBuffer), path: files[0].name })
        const details = document.getElementById("applyPresentationStateToImage-image-in-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(model.inputs.get("imageIn").data.subarray(0, 50).toString() + ' ...')}</pre>`
        details.disabled = false
    })

    const presentationStateFileElement = document.querySelector('#applyPresentationStateToImageInputs input[name=presentation-state-file-file]')
    presentationStateFileElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const arrayBuffer = await files[0].arrayBuffer()
        model.inputs.set("presentationStateFile", { data: new Uint8Array(arrayBuffer), path: files[0].name })
        const details = document.getElementById("applyPresentationStateToImage-presentation-state-file-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(model.inputs.get("presentationStateFile").data.subarray(0, 50).toString() + ' ...')}</pre>`
        details.disabled = false
    })

    // ----------------------------------------------
    // Options
    const colorOutputElement = document.querySelector('#applyPresentationStateToImageInputs sl-checkbox[name=color-output]')
    colorOutputElement.addEventListener('sl-change', (event) => {
        model.options.set("colorOutput", colorOutputElement.checked)
    })

    const configFileElement = document.querySelector('#applyPresentationStateToImageInputs sl-input[name=config-file]')
    configFileElement.addEventListener('sl-change', (event) => {
        model.options.set("configFile", configFileElement.value)
    })

    const frameElement = document.querySelector('#applyPresentationStateToImageInputs sl-input[name=frame]')
    frameElement.addEventListener('sl-change', (event) => {
        model.options.set("frame", parseInt(frameElement.value))
    })

    const noPresentationStateOutputElement = document.querySelector('#applyPresentationStateToImageInputs sl-checkbox[name=no-presentation-state-output]')
    noPresentationStateOutputElement.addEventListener('sl-change', (event) => {
        model.options.set("noPresentationStateOutput", noPresentationStateOutputElement.checked)
    })

    const noBitmapOutputElement = document.querySelector('#applyPresentationStateToImageInputs sl-checkbox[name=no-bitmap-output]')
    noBitmapOutputElement.addEventListener('sl-change', (event) => {
        model.options.set("noBitmapOutput", noBitmapOutputElement.checked)
    })

    // ----------------------------------------------
    // Outputs
    const presentationStateOutStreamOutputDownload = document.querySelector('#applyPresentationStateToImageOutputs sl-button[name=presentation-state-out-stream-download]')
    presentationStateOutStreamOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("presentationStateOutStream")) {
            const fileName = `presentationStateOutStream.json`
            globalThis.downloadFile(new TextEncoder().encode(JSON.stringify(model.outputs.get("presentationStateOutStream"))), fileName)
        }
    })

    const outputImageOutputDownload = document.querySelector('#applyPresentationStateToImageOutputs sl-button[name=output-image-download]')
    outputImageOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("outputImage")) {
            const outputImageDownloadFormat = document.getElementById('applyPresentationStateToImage-output-image-output-format')
            const downloadFormat = outputImageDownloadFormat.value || 'nrrd'
            const fileName = `outputImage.${downloadFormat}`
            const { webWorker, serializedImage } = await writeImage(model.outputs.get("outputImage"), fileName)

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
      if (event.detail.name === 'applyPresentationStateToImage-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'applyPresentationStateToImage') {
          params.set('functionName', 'applyPresentationStateToImage')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'applyPresentationStateToImage' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'applyPresentationStateToImage') {
        tabGroup.show('applyPresentationStateToImage-panel')
        preRun()
      }
    }
    onInit()

    const runButton = document.querySelector('#applyPresentationStateToImageInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('imageIn')) {
        globalThis.notify("Required input not provided", "imageIn", "danger", "exclamation-octagon")
        return
      }
      if(!model.inputs.has('presentationStateFile')) {
        globalThis.notify("Required input not provided", "presentationStateFile", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true

        const t0 = performance.now()
        const { presentationStateOutStream, outputImage, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("applyPresentationStateToImage successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("presentationStateOutStream", presentationStateOutStream)
        presentationStateOutStreamOutputDownload.variant = "success"
        presentationStateOutStreamOutputDownload.disabled = false
        const presentationStateOutStreamDetails = document.getElementById("applyPresentationStateToImage-presentation-state-out-stream-details")
        presentationStateOutStreamDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(presentationStateOutStream, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        presentationStateOutStreamDetails.disabled = false
        const presentationStateOutStreamOutput = document.getElementById("applyPresentationStateToImage-presentation-state-out-stream-details")

        model.outputs.set("outputImage", outputImage)
        outputImageOutputDownload.variant = "success"
        outputImageOutputDownload.disabled = false
        const outputImageDetails = document.getElementById("applyPresentationStateToImage-output-image-details")
        outputImageDetails.disabled = false
        outputImageDetails.setImage(outputImage)
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
    const { presentationStateOutStream, outputImage, } = await dicom.applyPresentationStateToImage(      { data: this.model.inputs.get('imageIn').data.slice(), path: this.model.inputs.get('imageIn').path },
      { data: this.model.inputs.get('presentationStateFile').data.slice(), path: this.model.inputs.get('presentationStateFile').path },
      Object.fromEntries(this.model.options.entries())
    )

    return { presentationStateOutStream, outputImage, }
  }
}

const applyPresentationStateToImageController = new ApplyPresentationStateToImageController(applyPresentationStateToImageLoadSampleInputs)
