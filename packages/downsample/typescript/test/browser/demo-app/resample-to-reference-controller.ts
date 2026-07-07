// Generated file. To retain edits, remove this comment.

import { readImage } from '@itk-wasm/image-io'
import { readTransform } from '@itk-wasm/transform-io'
import { writeImage } from '@itk-wasm/image-io'
import * as downsample from '../../../dist/index.js'
import resampleToReferenceLoadSampleInputs, { usePreRun } from "./resample-to-reference-load-sample-inputs.js"

class ResampleToReferenceModel {
  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
}


class ResampleToReferenceController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new ResampleToReferenceModel()
    const model = this.model

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#resampleToReferenceInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const inputElement = document.querySelector('#resampleToReferenceInputs input[name=input-file]')
    inputElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const { image, webWorker } = await readImage(files[0])
        webWorker.terminate()
        model.inputs.set("input", image)
        const details = document.getElementById("resampleToReference-input-details")
        details.setImage(image)
        details.disabled = false
    })

    const referenceImageElement = document.querySelector('#resampleToReferenceInputs input[name=reference-image-file]')
    referenceImageElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const { image, webWorker } = await readImage(files[0])
        webWorker.terminate()
        model.inputs.set("referenceImage", image)
        const details = document.getElementById("resampleToReference-reference-image-details")
        details.setImage(image)
        details.disabled = false
    })

    // ----------------------------------------------
    // Options
    const transformElement = document.querySelector('#resampleToReferenceInputs input[name=transform-file]')
    transformElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const { transform, webWorker } = await readTransform(files[0])
        webWorker.terminate()
        model.options.set("transform", transform)
        const details = document.getElementById("resampleToReference-transform-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(transform, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        details.disabled = false
    })

    const interpolatorElement = document.querySelector('#resampleToReferenceInputs sl-input[name=interpolator]')
    interpolatorElement.addEventListener('sl-change', (event) => {
        model.options.set("interpolator", interpolatorElement.value)
    })

    const defaultValueElement = document.querySelector('#resampleToReferenceInputs sl-input[name=default-value]')
    defaultValueElement.addEventListener('sl-change', (event) => {
        model.options.set("defaultValue", parseFloat(defaultValueElement.value))
    })

    // ----------------------------------------------
    // Outputs
    const outputOutputDownload = document.querySelector('#resampleToReferenceOutputs sl-button[name=output-download]')
    outputOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("output")) {
            const outputDownloadFormat = document.getElementById('resampleToReference-output-output-format')
            const downloadFormat = outputDownloadFormat.value || 'nrrd'
            const fileName = `output.${downloadFormat}`
            const { webWorker, serializedImage } = await writeImage(model.outputs.get("output"), fileName)

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
      if (event.detail.name === 'resampleToReference-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'resampleToReference') {
          params.set('functionName', 'resampleToReference')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'resampleToReference' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'resampleToReference') {
        tabGroup.show('resampleToReference-panel')
        preRun()
      }
    }
    onInit()

    const runButton = document.querySelector('#resampleToReferenceInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('input')) {
        globalThis.notify("Required input not provided", "input", "danger", "exclamation-octagon")
        return
      }
      if(!model.inputs.has('referenceImage')) {
        globalThis.notify("Required input not provided", "referenceImage", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true

        const t0 = performance.now()
        const { output, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("resampleToReference successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("output", output)
        outputOutputDownload.variant = "success"
        outputOutputDownload.disabled = false
        const outputDetails = document.getElementById("resampleToReference-output-details")
        outputDetails.disabled = false
        outputDetails.setImage(output)
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
    const { output, } = await downsample.resampleToReference(      this.model.inputs.get('input'),
      this.model.inputs.get('referenceImage'),
      Object.fromEntries(this.model.options.entries())
    )

    return { output, }
  }
}

const resampleToReferenceController = new ResampleToReferenceController(resampleToReferenceLoadSampleInputs)
