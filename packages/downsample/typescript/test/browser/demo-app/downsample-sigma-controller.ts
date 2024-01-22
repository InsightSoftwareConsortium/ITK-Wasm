// Generated file. To retain edits, remove this comment.

import * as downsample from '../../../dist/index.js'
import downsampleSigmaLoadSampleInputs, { usePreRun } from "./downsample-sigma-load-sample-inputs.js"

class DownsampleSigmaModel {
  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
}


class DownsampleSigmaController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new DownsampleSigmaModel()
    const model = this.model

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#downsampleSigmaInputs [name=loadSampleInputs]")
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
    const shrinkFactorsElement = document.querySelector('#downsampleSigmaInputs sl-input[name=shrink-factors]')
    shrinkFactorsElement.addEventListener('sl-change', (event) => {
        globalThis.applyInputParsedJson(shrinkFactorsElement, model.options, "shrinkFactors")
    })

    // ----------------------------------------------
    // Outputs
    const sigmaOutputDownload = document.querySelector('#downsampleSigmaOutputs sl-button[name=sigma-download]')
    sigmaOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("sigma")) {
            const fileName = `sigma.json`
            globalThis.downloadFile(new TextEncoder().encode(JSON.stringify(model.outputs.get("sigma"))), fileName)
        }
    })

    const preRun = async () => {
      if (loadSampleInputs && usePreRun) {
        await loadSampleInputs(model, true)
        await this.run()
      }
    }

    const onSelectTab = async (event) => {
      if (event.detail.name === 'downsampleSigma-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'downsampleSigma') {
          params.set('functionName', 'downsampleSigma')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'downsampleSigma' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'downsampleSigma') {
        tabGroup.show('downsampleSigma-panel')
        preRun()
      }
    }
    onInit()

    const runButton = document.querySelector('#downsampleSigmaInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()



      try {
        runButton.loading = true

        const t0 = performance.now()
        const { sigma, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("downsampleSigma successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("sigma", sigma)
        sigmaOutputDownload.variant = "success"
        sigmaOutputDownload.disabled = false
        const sigmaDetails = document.getElementById("downsampleSigma-sigma-details")
        sigmaDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(sigma, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        sigmaDetails.disabled = false
        const sigmaOutput = document.getElementById("downsampleSigma-sigma-details")
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
    const { sigma, } = await downsample.downsampleSigma(      Object.fromEntries(this.model.options.entries())
    )

    return { sigma, }
  }
}

const downsampleSigmaController = new DownsampleSigmaController(downsampleSigmaLoadSampleInputs)
