// Generated file. To retain edits, remove this comment.

import { writeMesh } from '../../../dist/index.js'
import * as meshIo from '../../../dist/index.js'
import offReadMeshLoadSampleInputs, { usePreRun } from "./off-read-mesh-load-sample-inputs.js"

class OffReadMeshModel {
  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
}


class OffReadMeshController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new OffReadMeshModel()
    const model = this.model

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#offReadMeshInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const serializedMeshElement = document.querySelector('#offReadMeshInputs input[name=serialized-mesh-file]')
    serializedMeshElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const arrayBuffer = await files[0].arrayBuffer()
        model.inputs.set("serializedMesh", { data: new Uint8Array(arrayBuffer), path: files[0].name })
        const details = document.getElementById("offReadMesh-serialized-mesh-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(model.inputs.get("serializedMesh").data.subarray(0, 50).toString() + ' ...')}</pre>`
        details.disabled = false
    })

    // ----------------------------------------------
    // Options
    const informationOnlyElement = document.querySelector('#offReadMeshInputs sl-checkbox[name=information-only]')
    informationOnlyElement.addEventListener('sl-change', (event) => {
        model.options.set("informationOnly", informationOnlyElement.checked)
    })

    // ----------------------------------------------
    // Outputs
    const couldReadOutputDownload = document.querySelector('#offReadMeshOutputs sl-button[name=could-read-download]')
    couldReadOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("couldRead")) {
            const fileName = `couldRead.json`
            globalThis.downloadFile(new TextEncoder().encode(JSON.stringify(model.outputs.get("couldRead"))), fileName)
        }
    })

    const meshOutputDownload = document.querySelector('#offReadMeshOutputs sl-button[name=mesh-download]')
    meshOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("mesh")) {
            const meshDownloadFormat = document.getElementById('offReadMesh-mesh-output-format')
            const downloadFormat = meshDownloadFormat.value || 'vtk'
            const fileName = `mesh.${downloadFormat}`
            const { webWorker, serializedMesh } = await writeMesh(model.outputs.get("mesh"), fileName)

            webWorker.terminate()
            globalThis.downloadFile(serializedMesh.data, fileName)
        }
    })

    const preRun = async () => {
      if (loadSampleInputs && usePreRun) {
        await loadSampleInputs(model, true)
        await this.run()
      }
    }

    const onSelectTab = async (event) => {
      if (event.detail.name === 'offReadMesh-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'offReadMesh') {
          params.set('functionName', 'offReadMesh')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'offReadMesh' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'offReadMesh') {
        tabGroup.show('offReadMesh-panel')
        preRun()
      }
    }
    onInit()

    const runButton = document.querySelector('#offReadMeshInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('serializedMesh')) {
        globalThis.notify("Required input not provided", "serializedMesh", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true

        const t0 = performance.now()
        const { couldRead, mesh, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("offReadMesh successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("couldRead", couldRead)
        couldReadOutputDownload.variant = "success"
        couldReadOutputDownload.disabled = false
        const couldReadDetails = document.getElementById("offReadMesh-could-read-details")
        couldReadDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(couldRead, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        couldReadDetails.disabled = false
        const couldReadOutput = document.getElementById("offReadMesh-could-read-details")

        model.outputs.set("mesh", mesh)
        meshOutputDownload.variant = "success"
        meshOutputDownload.disabled = false
        const meshDetails = document.getElementById("offReadMesh-mesh-details")
        meshDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(mesh, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        meshDetails.disabled = false
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
    const { couldRead, mesh, } = await meshIo.offReadMesh(      { data: this.model.inputs.get('serializedMesh').data.slice(), path: this.model.inputs.get('serializedMesh').path },
      Object.fromEntries(this.model.options.entries())
    )

    return { couldRead, mesh, }
  }
}

const offReadMeshController = new OffReadMeshController(offReadMeshLoadSampleInputs)
