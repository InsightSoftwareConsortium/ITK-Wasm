// Generated file. To retain edits, remove this comment.

import { readTransform } from '../../../dist/index.js'
import * as transformIo from '../../../dist/index.js'
import mncWriteTransformLoadSampleInputs, { usePreRun } from "./mnc-write-transform-load-sample-inputs.js"

class MncWriteTransformModel {
  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
}


class MncWriteTransformController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new MncWriteTransformModel()
    const model = this.model

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#mncWriteTransformInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const transformElement = document.querySelector('#mncWriteTransformInputs input[name=transform-file]')
    transformElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const { transform, webWorker } = await readTransform(files[0])
        webWorker.terminate()
        model.inputs.set("transform", transform)
        const details = document.getElementById("mncWriteTransform-transform-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(transform, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        details.disabled = false
    })

    const serializedTransformElement = document.querySelector('#mncWriteTransformInputs sl-input[name=serialized-transform]')
    serializedTransformElement.addEventListener('sl-change', (event) => {
        model.inputs.set("serializedTransform", serializedTransformElement.value)
    })

    // ----------------------------------------------
    // Options
    const floatParametersElement = document.querySelector('#mncWriteTransformInputs sl-checkbox[name=float-parameters]')
    floatParametersElement.addEventListener('sl-change', (event) => {
        model.options.set("floatParameters", floatParametersElement.checked)
    })

    const useCompressionElement = document.querySelector('#mncWriteTransformInputs sl-checkbox[name=use-compression]')
    useCompressionElement.addEventListener('sl-change', (event) => {
        model.options.set("useCompression", useCompressionElement.checked)
    })

    // ----------------------------------------------
    // Outputs
    const couldWriteOutputDownload = document.querySelector('#mncWriteTransformOutputs sl-button[name=could-write-download]')
    couldWriteOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("couldWrite")) {
            const fileName = `couldWrite.json`
            globalThis.downloadFile(new TextEncoder().encode(JSON.stringify(model.outputs.get("couldWrite"))), fileName)
        }
    })

    const serializedTransformOutputDownload = document.querySelector('#mncWriteTransformOutputs sl-button[name=serialized-transform-download]')
    serializedTransformOutputDownload.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("serializedTransform")) {
            globalThis.downloadFile(model.outputs.get("serializedTransform").data, model.outputs.get("serializedTransform").path)
        }
    })

    const preRun = async () => {
      if (loadSampleInputs && usePreRun) {
        await loadSampleInputs(model, true)
        await this.run()
      }
    }

    const onSelectTab = async (event) => {
      if (event.detail.name === 'mncWriteTransform-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'mncWriteTransform') {
          params.set('functionName', 'mncWriteTransform')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'mncWriteTransform' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'mncWriteTransform') {
        tabGroup.show('mncWriteTransform-panel')
        preRun()
      }
    }
    onInit()

    const runButton = document.querySelector('#mncWriteTransformInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('transform')) {
        globalThis.notify("Required input not provided", "transform", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true

        const t0 = performance.now()
        const { couldWrite, serializedTransform, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("mncWriteTransform successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("couldWrite", couldWrite)
        couldWriteOutputDownload.variant = "success"
        couldWriteOutputDownload.disabled = false
        const couldWriteDetails = document.getElementById("mncWriteTransform-could-write-details")
        couldWriteDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(couldWrite, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        couldWriteDetails.disabled = false
        const couldWriteOutput = document.getElementById("mncWriteTransform-could-write-details")

        model.outputs.set("serializedTransform", serializedTransform)
        serializedTransformOutputDownload.variant = "success"
        serializedTransformOutputDownload.disabled = false
        const serializedTransformOutput = document.getElementById("mncWriteTransform-serialized-transform-details")
        serializedTransformOutput.innerHTML = `<pre>${globalThis.escapeHtml(serializedTransform.data.subarray(0, 1024).toString() + ' ...')}</pre>`
        serializedTransformOutput.disabled = false
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
    const { couldWrite, serializedTransform, } = await transformIo.mncWriteTransform(      this.model.inputs.get('transform'),
      this.model.inputs.get('serializedTransform'),
      Object.fromEntries(this.model.options.entries())
    )

    return { couldWrite, serializedTransform, }
  }
}

const mncWriteTransformController = new MncWriteTransformController(mncWriteTransformLoadSampleInputs)
