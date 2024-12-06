// Generated file. To retain edits, remove this comment.

import { readPointSet } from '../../../dist/index.js'
import * as meshIo from '../../../dist/index.js'
import mz3WritePointSetLoadSampleInputs, { usePreRun } from "./mz3-write-point-set-load-sample-inputs.js"

class Mz3WritePointSetModel {
  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
}


class Mz3WritePointSetController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new Mz3WritePointSetModel()
    const model = this.model

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#mz3WritePointSetInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const pointSetElement = document.querySelector('#mz3WritePointSetInputs input[name=point-set-file]')
    pointSetElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const { pointSet, webWorker } = await readPointSet(files[0])
        webWorker.terminate()
        model.inputs.set("pointSet", pointSet)
        const details = document.getElementById("mz3WritePointSet-point-set-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(pointSet, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        details.disabled = false
    })

    const serializedPointSetElement = document.querySelector('#mz3WritePointSetInputs sl-input[name=serialized-point-set]')
    serializedPointSetElement.addEventListener('sl-change', (event) => {
        model.inputs.set("serializedPointSet", serializedPointSetElement.value)
    })

    // ----------------------------------------------
    // Options
    const informationOnlyElement = document.querySelector('#mz3WritePointSetInputs sl-checkbox[name=information-only]')
    informationOnlyElement.addEventListener('sl-change', (event) => {
        model.options.set("informationOnly", informationOnlyElement.checked)
    })

    const useCompressionElement = document.querySelector('#mz3WritePointSetInputs sl-checkbox[name=use-compression]')
    useCompressionElement.addEventListener('sl-change', (event) => {
        model.options.set("useCompression", useCompressionElement.checked)
    })

    const binaryFileTypeElement = document.querySelector('#mz3WritePointSetInputs sl-checkbox[name=binary-file-type]')
    binaryFileTypeElement.addEventListener('sl-change', (event) => {
        model.options.set("binaryFileType", binaryFileTypeElement.checked)
    })

    // ----------------------------------------------
    // Outputs
    const couldWriteOutputDownload = document.querySelector('#mz3WritePointSetOutputs sl-button[name=could-write-download]')
    couldWriteOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("couldWrite")) {
            const fileName = `couldWrite.json`
            globalThis.downloadFile(new TextEncoder().encode(JSON.stringify(model.outputs.get("couldWrite"))), fileName)
        }
    })

    const serializedPointSetOutputDownload = document.querySelector('#mz3WritePointSetOutputs sl-button[name=serialized-point-set-download]')
    serializedPointSetOutputDownload.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("serializedPointSet")) {
            globalThis.downloadFile(model.outputs.get("serializedPointSet").data, model.outputs.get("serializedPointSet").path)
        }
    })

    const preRun = async () => {
      if (loadSampleInputs && usePreRun) {
        await loadSampleInputs(model, true)
        await this.run()
      }
    }

    const onSelectTab = async (event) => {
      if (event.detail.name === 'mz3WritePointSet-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'mz3WritePointSet') {
          params.set('functionName', 'mz3WritePointSet')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'mz3WritePointSet' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'mz3WritePointSet') {
        tabGroup.show('mz3WritePointSet-panel')
        preRun()
      }
    }
    onInit()

    const runButton = document.querySelector('#mz3WritePointSetInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('pointSet')) {
        globalThis.notify("Required input not provided", "pointSet", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true

        const t0 = performance.now()
        const { couldWrite, serializedPointSet, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("mz3WritePointSet successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("couldWrite", couldWrite)
        couldWriteOutputDownload.variant = "success"
        couldWriteOutputDownload.disabled = false
        const couldWriteDetails = document.getElementById("mz3WritePointSet-could-write-details")
        couldWriteDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(couldWrite, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        couldWriteDetails.disabled = false
        const couldWriteOutput = document.getElementById("mz3WritePointSet-could-write-details")

        model.outputs.set("serializedPointSet", serializedPointSet)
        serializedPointSetOutputDownload.variant = "success"
        serializedPointSetOutputDownload.disabled = false
        const serializedPointSetOutput = document.getElementById("mz3WritePointSet-serialized-point-set-details")
        serializedPointSetOutput.innerHTML = `<pre>${globalThis.escapeHtml(serializedPointSet.data.subarray(0, 1024).toString() + ' ...')}</pre>`
        serializedPointSetOutput.disabled = false
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
    const { couldWrite, serializedPointSet, } = await meshIo.mz3WritePointSet(      this.model.inputs.get('pointSet'),
      this.model.inputs.get('serializedPointSet'),
      Object.fromEntries(this.model.options.entries())
    )

    return { couldWrite, serializedPointSet, }
  }
}

const mz3WritePointSetController = new Mz3WritePointSetController(mz3WritePointSetLoadSampleInputs)
