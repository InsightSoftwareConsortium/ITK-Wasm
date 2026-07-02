// Generated file. To retain edits, remove this comment.

import { readImage } from '@itk-wasm/image-io'
import { readTransform } from '@itk-wasm/transform-io'
import * as downsample from '../../../dist/index.js'
import resampleBoundingBoxLoadSampleInputs, { usePreRun } from "./resample-bounding-box-load-sample-inputs.js"

class ResampleBoundingBoxModel {
  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
}


class ResampleBoundingBoxController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new ResampleBoundingBoxModel()
    const model = this.model

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#resampleBoundingBoxInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const transformElement = document.querySelector('#resampleBoundingBoxInputs input[name=transform-file]')
    transformElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const { transform, webWorker } = await readTransform(files[0])
        webWorker.terminate()
        model.inputs.set("transform", transform)
        const details = document.getElementById("resampleBoundingBox-transform-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(transform, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        details.disabled = false
    })

    const fixedElement = document.querySelector('#resampleBoundingBoxInputs input[name=fixed-file]')
    fixedElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const { image, webWorker } = await readImage(files[0])
        webWorker.terminate()
        model.inputs.set("fixed", image)
        const details = document.getElementById("resampleBoundingBox-fixed-details")
        details.setImage(image)
        details.disabled = false
    })

    const movingElement = document.querySelector('#resampleBoundingBoxInputs input[name=moving-file]')
    movingElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const { image, webWorker } = await readImage(files[0])
        webWorker.terminate()
        model.inputs.set("moving", image)
        const details = document.getElementById("resampleBoundingBox-moving-details")
        details.setImage(image)
        details.disabled = false
    })

    // ----------------------------------------------
    // Options
    const paddingElement = document.querySelector('#resampleBoundingBoxInputs sl-input[name=padding]')
    paddingElement.addEventListener('sl-change', (event) => {
        model.options.set("padding", parseInt(paddingElement.value))
    })

    // ----------------------------------------------
    // Outputs
    const boundingBoxOutputDownload = document.querySelector('#resampleBoundingBoxOutputs sl-button[name=bounding-box-download]')
    boundingBoxOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("boundingBox")) {
            const fileName = `boundingBox.json`
            globalThis.downloadFile(new TextEncoder().encode(JSON.stringify(model.outputs.get("boundingBox"))), fileName)
        }
    })

    const preRun = async () => {
      if (loadSampleInputs && usePreRun) {
        await loadSampleInputs(model, true)
        await this.run()
      }
    }

    const onSelectTab = async (event) => {
      if (event.detail.name === 'resampleBoundingBox-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'resampleBoundingBox') {
          params.set('functionName', 'resampleBoundingBox')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'resampleBoundingBox' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'resampleBoundingBox') {
        tabGroup.show('resampleBoundingBox-panel')
        preRun()
      }
    }
    onInit()

    const runButton = document.querySelector('#resampleBoundingBoxInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('transform')) {
        globalThis.notify("Required input not provided", "transform", "danger", "exclamation-octagon")
        return
      }
      if(!model.inputs.has('fixed')) {
        globalThis.notify("Required input not provided", "fixed", "danger", "exclamation-octagon")
        return
      }
      if(!model.inputs.has('moving')) {
        globalThis.notify("Required input not provided", "moving", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true

        const t0 = performance.now()
        const { boundingBox, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("resampleBoundingBox successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("boundingBox", boundingBox)
        boundingBoxOutputDownload.variant = "success"
        boundingBoxOutputDownload.disabled = false
        const boundingBoxDetails = document.getElementById("resampleBoundingBox-bounding-box-details")
        boundingBoxDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(boundingBox, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        boundingBoxDetails.disabled = false
        const boundingBoxOutput = document.getElementById("resampleBoundingBox-bounding-box-details")
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
    const { boundingBox, } = await downsample.resampleBoundingBox(      this.model.inputs.get('transform'),
      this.model.inputs.get('fixed'),
      this.model.inputs.get('moving'),
      Object.fromEntries(this.model.options.entries())
    )

    return { boundingBox, }
  }
}

const resampleBoundingBoxController = new ResampleBoundingBoxController(resampleBoundingBoxLoadSampleInputs)
