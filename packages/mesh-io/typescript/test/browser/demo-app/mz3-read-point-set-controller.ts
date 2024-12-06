// Generated file. To retain edits, remove this comment.

import { writePointSet } from '../../../dist/index.js'
import * as meshIo from '../../../dist/index.js'
import mz3ReadPointSetLoadSampleInputs, { usePreRun } from "./mz3-read-point-set-load-sample-inputs.js"

class Mz3ReadPointSetModel {
  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
}


class Mz3ReadPointSetController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new Mz3ReadPointSetModel()
    const model = this.model

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#mz3ReadPointSetInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const serializedPointSetElement = document.querySelector('#mz3ReadPointSetInputs input[name=serialized-point-set-file]')
    serializedPointSetElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const arrayBuffer = await files[0].arrayBuffer()
        model.inputs.set("serializedPointSet", { data: new Uint8Array(arrayBuffer), path: files[0].name })
        const details = document.getElementById("mz3ReadPointSet-serialized-point-set-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(model.inputs.get("serializedPointSet").data.subarray(0, 50).toString() + ' ...')}</pre>`
        details.disabled = false
    })

    // ----------------------------------------------
    // Options
    const informationOnlyElement = document.querySelector('#mz3ReadPointSetInputs sl-checkbox[name=information-only]')
    informationOnlyElement.addEventListener('sl-change', (event) => {
        model.options.set("informationOnly", informationOnlyElement.checked)
    })

    // ----------------------------------------------
    // Outputs
    const couldReadOutputDownload = document.querySelector('#mz3ReadPointSetOutputs sl-button[name=could-read-download]')
    couldReadOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("couldRead")) {
            const fileName = `couldRead.json`
            globalThis.downloadFile(new TextEncoder().encode(JSON.stringify(model.outputs.get("couldRead"))), fileName)
        }
    })

    const pointSetOutputDownload = document.querySelector('#mz3ReadPointSetOutputs sl-button[name=point-set-download]')
    pointSetOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("pointSet")) {
            const pointSetDownloadFormat = document.getElementById('mz3ReadPointSet-point-set-output-format')
            const downloadFormat = pointSetDownloadFormat.value || 'vtk'
            const fileName = `pointSet.${downloadFormat}`
            const { webWorker, serializedPointSet } = await writePointSet(model.outputs.get("pointSet"), fileName)

            globalThis.downloadFile(serializedPointSet.data, fileName)
            webWorker.terminate()
        }
    })

    const preRun = async () => {
      if (loadSampleInputs && usePreRun) {
        await loadSampleInputs(model, true)
        await this.run()
      }
    }

    const onSelectTab = async (event) => {
      if (event.detail.name === 'mz3ReadPointSet-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'mz3ReadPointSet') {
          params.set('functionName', 'mz3ReadPointSet')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'mz3ReadPointSet' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'mz3ReadPointSet') {
        tabGroup.show('mz3ReadPointSet-panel')
        preRun()
      }
    }
    onInit()

    const runButton = document.querySelector('#mz3ReadPointSetInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('serializedPointSet')) {
        globalThis.notify("Required input not provided", "serializedPointSet", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true

        const t0 = performance.now()
        const { couldRead, pointSet, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("mz3ReadPointSet successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("couldRead", couldRead)
        couldReadOutputDownload.variant = "success"
        couldReadOutputDownload.disabled = false
        const couldReadDetails = document.getElementById("mz3ReadPointSet-could-read-details")
        couldReadDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(couldRead, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        couldReadDetails.disabled = false
        const couldReadOutput = document.getElementById("mz3ReadPointSet-could-read-details")

        model.outputs.set("pointSet", pointSet)
        pointSetOutputDownload.variant = "success"
        pointSetOutputDownload.disabled = false
        const pointSetDetails = document.getElementById("mz3ReadPointSet-point-set-details")
        pointSetDetails.disabled = false
        pointSetDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(pointSet, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
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
    const { couldRead, pointSet, } = await meshIo.mz3ReadPointSet(      { data: this.model.inputs.get('serializedPointSet').data.slice(), path: this.model.inputs.get('serializedPointSet').path },
      Object.fromEntries(this.model.options.entries())
    )

    return { couldRead, pointSet, }
  }
}

const mz3ReadPointSetController = new Mz3ReadPointSetController(mz3ReadPointSetLoadSampleInputs)
