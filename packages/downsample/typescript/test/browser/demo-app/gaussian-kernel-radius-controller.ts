// Generated file. To retain edits, remove this comment.

import * as downsample from '../../../dist/index.js'
import gaussianKernelRadiusLoadSampleInputs, { usePreRun } from "./gaussian-kernel-radius-load-sample-inputs.js"

class GaussianKernelRadiusModel {
  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
}


class GaussianKernelRadiusController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new GaussianKernelRadiusModel()
    const model = this.model

    this.webWorker = null

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#gaussianKernelRadiusInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    // ----------------------------------------------
    // Options
    const sizeElement = document.querySelector('#gaussianKernelRadiusInputs sl-input[name=size]')
    sizeElement.addEventListener('sl-change', (event) => {
        model.options.set("size", parseInt(sizeElement.value))
    })

    const sigmaElement = document.querySelector('#gaussianKernelRadiusInputs sl-input[name=sigma]')
    sigmaElement.addEventListener('sl-change', (event) => {
        model.options.set("sigma", parseFloat(sigmaElement.value))
    })

    const maxKernelWidthElement = document.querySelector('#gaussianKernelRadiusInputs sl-input[name=max-kernel-width]')
    maxKernelWidthElement.addEventListener('sl-change', (event) => {
        model.options.set("maxKernelWidth", parseInt(maxKernelWidthElement.value))
    })

    const maxKernelErrorElement = document.querySelector('#gaussianKernelRadiusInputs sl-input[name=max-kernel-error]')
    maxKernelErrorElement.addEventListener('sl-change', (event) => {
        model.options.set("maxKernelError", parseFloat(maxKernelErrorElement.value))
    })

    // ----------------------------------------------
    // Outputs
    const radiusOutputDownload = document.querySelector('#gaussianKernelRadiusOutputs sl-button[name=radius-download]')
    radiusOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("radius")) {
            const fileName = `radius.json`
            globalThis.downloadFile(new TextEncoder().encode(JSON.stringify(model.outputs.get("radius"))), fileName)
        }
    })

    const preRun = async () => {
      if (!this.webWorker && loadSampleInputs && usePreRun) {
        await loadSampleInputs(model, true)
        await this.run()
      }
    }

    const onSelectTab = async (event) => {
      if (event.detail.name === 'gaussianKernelRadius-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'gaussianKernelRadius') {
          params.set('functionName', 'gaussianKernelRadius')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'gaussianKernelRadius' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'gaussianKernelRadius') {
        tabGroup.show('gaussianKernelRadius-panel')
        preRun()
      }
    }
    onInit()

    const runButton = document.querySelector('#gaussianKernelRadiusInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()



      try {
        runButton.loading = true

        const t0 = performance.now()
        const { radius, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("gaussianKernelRadius successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("radius", radius)
        radiusOutputDownload.variant = "success"
        radiusOutputDownload.disabled = false
        const radiusDetails = document.getElementById("gaussianKernelRadius-radius-details")
        radiusDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(radius, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        radiusDetails.disabled = false
        const radiusOutput = document.getElementById("gaussianKernelRadius-radius-details")
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
    const { webWorker, radius, } = await downsample.gaussianKernelRadius(      Object.fromEntries(this.model.options.entries())
    )
    this.webWorker = webWorker

    return { radius, }
  }
}

const gaussianKernelRadiusController = new GaussianKernelRadiusController(gaussianKernelRadiusLoadSampleInputs)
