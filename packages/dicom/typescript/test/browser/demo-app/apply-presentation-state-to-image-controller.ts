// Generated file. To retain edits, remove this comment.

import { writeImageArrayBuffer } from 'itk-wasm'
import * as dicom from '../../../dist/bundles/dicom.js'
import applyPresentationStateToImageLoadSampleInputs from "./apply-presentation-state-to-image-load-sample-inputs.js"

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


class ApplyPresentationStateToImageController  {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new ApplyPresentationStateToImageModel()
    const model = this.model

    this.webWorker = null

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#applyPresentationStateToImageInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', (event) => {
        loadSampleInputs(model)
      })
    }

    // ----------------------------------------------
    // Inputs
    const imageInElement = document.querySelector('#applyPresentationStateToImageInputs input[name=image-in-file]')
    imageInElement.addEventListener('change', (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        files[0].arrayBuffer().then((arrayBuffer) => {
            model.inputs.set("imageIn", { data: new Uint8Array(arrayBuffer), path: files[0].name })
            const input = document.querySelector("#applyPresentationStateToImageInputs sl-input[name=image-in]")
            input.value = model.inputs.get("imageIn").data.subarray(0, 50).toString() + ' ...'
        })
    })

    const presentationStateFileElement = document.querySelector('#applyPresentationStateToImageInputs input[name=presentation-state-file-file]')
    presentationStateFileElement.addEventListener('change', (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        files[0].arrayBuffer().then((arrayBuffer) => {
            model.inputs.set("presentationStateFile", { data: new Uint8Array(arrayBuffer), path: files[0].name })
            const input = document.querySelector("#applyPresentationStateToImageInputs sl-input[name=presentation-state-file]")
            input.value = model.inputs.get("presentationStateFile").data.subarray(0, 50).toString() + ' ...'
        })
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
            const outputImageDownloadFormat = document.getElementById('output-image-output-format')
            const downloadFormat = outputImageDownloadFormat.value || 'nrrd'
            const fileName = `outputImage.${downloadFormat}`
            const { webWorker, arrayBuffer } = await writeImageArrayBuffer(null, model.outputs.get("outputImage"), fileName)

            webWorker.terminate()
            globalThis.downloadFile(arrayBuffer, fileName)
        }
    })

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

        const { webWorker, presentationStateOutStream, outputImage, } = await dicom.applyPresentationStateToImage(this.webWorker,
          { data: model.inputs.get('imageIn').data.slice(), path: model.inputs.get('imageIn').path },
          { data: model.inputs.get('presentationStateFile').data.slice(), path: model.inputs.get('presentationStateFile').path },
          Object.fromEntries(model.options.entries())
        )

        const t1 = performance.now()
        globalThis.notify("applyPresentationStateToImage successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")
        this.webWorker = webWorker

        model.outputs.set("presentationStateOutStream", presentationStateOutStream)
        presentationStateOutStreamOutputDownload.variant = "success"
        presentationStateOutStreamOutputDownload.disabled = false
        const presentationStateOutStreamDetails = document.getElementById("presentation-state-out-stream-output")
        presentationStateOutStreamDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(presentationStateOutStream, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        presentationStateOutStreamDetails.disabled = false
        const presentationStateOutStreamOutput = document.querySelector('#applyPresentationStateToImageOutputs sl-details[name=presentation-state-out-stream]')

        model.outputs.set("outputImage", outputImage)
        outputImageOutputDownload.variant = "success"
        outputImageOutputDownload.disabled = false
        const outputImageDetails = document.getElementById("output-image-output")
        outputImageDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(outputImage, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        outputImageDetails.disabled = false
        const outputImageOutput = document.querySelector('#applyPresentationStateToImageOutputs sl-details[name=output-image]')
      } catch (error) {
        globalThis.notify("Error while running pipeline", error.toString(), "danger", "exclamation-octagon")
        throw error
      } finally {
        runButton.loading = false
      }
    })
  }
}

const applyPresentationStateToImageController = new ApplyPresentationStateToImageController(applyPresentationStateToImageLoadSampleInputs)
