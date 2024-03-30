// Generated file. To retain edits, remove this comment.

import { readImage } from '@itk-wasm/image-io'
import { writeImage } from '@itk-wasm/image-io'
import * as downsample from '../../../dist/index.js'
import downsampleLabelImageLoadSampleInputs, { usePreRun } from "./downsample-label-image-load-sample-inputs.js"

class DownsampleLabelImageModel {
  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
}


class DownsampleLabelImageController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new DownsampleLabelImageModel()
    const model = this.model

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#downsampleLabelImageInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const inputElement = document.querySelector('#downsampleLabelImageInputs input[name=input-file]')
    inputElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const { image, webWorker } = await readImage(files[0])
        webWorker.terminate()
        model.inputs.set("input", image)
        const details = document.getElementById("downsampleLabelImage-input-details")
        loadImage(image, details)
        details.disabled = false
    })

    // ----------------------------------------------
    // Options
    const shrinkFactorsElement = document.querySelector('#downsampleLabelImageInputs sl-input[name=shrink-factors]')
    shrinkFactorsElement.addEventListener('sl-change', (event) => {
        globalThis.applyInputParsedJson(shrinkFactorsElement, model.options, "shrinkFactors")
    })

    const cropRadiusElement = document.querySelector('#downsampleLabelImageInputs sl-input[name=crop-radius]')
    cropRadiusElement.addEventListener('sl-change', (event) => {
        globalThis.applyInputParsedJson(cropRadiusElement, model.options, "cropRadius")
    })

    // ----------------------------------------------
    // Outputs
    const downsampledOutputDownload = document.querySelector('#downsampleLabelImageOutputs sl-button[name=downsampled-download]')
    downsampledOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("downsampled")) {
            const downsampledDownloadFormat = document.getElementById('downsampleLabelImage-downsampled-output-format')
            const downloadFormat = downsampledDownloadFormat.value || 'nrrd'
            const fileName = `downsampled.${downloadFormat}`
            const { webWorker, serializedImage } = await writeImage(model.outputs.get("downsampled"), fileName)

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
      if (event.detail.name === 'downsampleLabelImage-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'downsampleLabelImage') {
          params.set('functionName', 'downsampleLabelImage')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'downsampleLabelImage' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'downsampleLabelImage') {
        tabGroup.show('downsampleLabelImage-panel')
        preRun()
      }
    }
    onInit()

    const runButton = document.querySelector('#downsampleLabelImageInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('input')) {
        globalThis.notify("Required input not provided", "input", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true

        const t0 = performance.now()
        const { downsampled, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("downsampleLabelImage successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("downsampled", downsampled)
        downsampledOutputDownload.variant = "success"
        downsampledOutputDownload.disabled = false
        const downsampledDetails = document.getElementById("downsampleLabelImage-downsampled-details")
        downsampledDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(downsampled, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        downsampledDetails.disabled = false
        loadImage(downsampled, downsampledDetails)
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
    const { downsampled, } = await downsample.downsampleLabelImage(      this.model.inputs.get('input'),
      Object.fromEntries(this.model.options.entries())
    )

    return { downsampled, }
  }
}

const downsampleLabelImageController = new DownsampleLabelImageController(downsampleLabelImageLoadSampleInputs)
