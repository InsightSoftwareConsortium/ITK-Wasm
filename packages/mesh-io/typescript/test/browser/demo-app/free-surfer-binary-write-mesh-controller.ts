// Generated file. To retain edits, remove this comment.

import { readMesh } from '../../../dist/index.js'
import * as meshIo from '../../../dist/index.js'
import freeSurferBinaryWriteMeshLoadSampleInputs, { usePreRun } from "./free-surfer-binary-write-mesh-load-sample-inputs.js"

class FreeSurferBinaryWriteMeshModel {
  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
}


class FreeSurferBinaryWriteMeshController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new FreeSurferBinaryWriteMeshModel()
    const model = this.model

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#freeSurferBinaryWriteMeshInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const meshElement = document.querySelector('#freeSurferBinaryWriteMeshInputs input[name=mesh-file]')
    meshElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const { mesh, webWorker } = await readMesh(files[0])
        webWorker.terminate()
        model.inputs.set("mesh", mesh)
        const details = document.getElementById("freeSurferBinaryWriteMesh-mesh-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(mesh, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        details.disabled = false
    })

    const serializedMeshElement = document.querySelector('#freeSurferBinaryWriteMeshInputs sl-input[name=serialized-mesh]')
    serializedMeshElement.addEventListener('sl-change', (event) => {
        model.inputs.set("serializedMesh", serializedMeshElement.value)
    })

    // ----------------------------------------------
    // Options
    const informationOnlyElement = document.querySelector('#freeSurferBinaryWriteMeshInputs sl-checkbox[name=information-only]')
    informationOnlyElement.addEventListener('sl-change', (event) => {
        model.options.set("informationOnly", informationOnlyElement.checked)
    })

    const useCompressionElement = document.querySelector('#freeSurferBinaryWriteMeshInputs sl-checkbox[name=use-compression]')
    useCompressionElement.addEventListener('sl-change', (event) => {
        model.options.set("useCompression", useCompressionElement.checked)
    })

    const binaryFileTypeElement = document.querySelector('#freeSurferBinaryWriteMeshInputs sl-checkbox[name=binary-file-type]')
    binaryFileTypeElement.addEventListener('sl-change', (event) => {
        model.options.set("binaryFileType", binaryFileTypeElement.checked)
    })

    // ----------------------------------------------
    // Outputs
    const couldWriteOutputDownload = document.querySelector('#freeSurferBinaryWriteMeshOutputs sl-button[name=could-write-download]')
    couldWriteOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("couldWrite")) {
            const fileName = `couldWrite.json`
            globalThis.downloadFile(new TextEncoder().encode(JSON.stringify(model.outputs.get("couldWrite"))), fileName)
        }
    })

    const serializedMeshOutputDownload = document.querySelector('#freeSurferBinaryWriteMeshOutputs sl-button[name=serialized-mesh-download]')
    serializedMeshOutputDownload.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("serializedMesh")) {
            globalThis.downloadFile(model.outputs.get("serializedMesh").data, model.outputs.get("serializedMesh").path)
        }
    })

    const preRun = async () => {
      if (loadSampleInputs && usePreRun) {
        await loadSampleInputs(model, true)
        await this.run()
      }
    }

    const onSelectTab = async (event) => {
      if (event.detail.name === 'freeSurferBinaryWriteMesh-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'freeSurferBinaryWriteMesh') {
          params.set('functionName', 'freeSurferBinaryWriteMesh')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'freeSurferBinaryWriteMesh' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'freeSurferBinaryWriteMesh') {
        tabGroup.show('freeSurferBinaryWriteMesh-panel')
        preRun()
      }
    }
    onInit()

    const runButton = document.querySelector('#freeSurferBinaryWriteMeshInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('mesh')) {
        globalThis.notify("Required input not provided", "mesh", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true

        const t0 = performance.now()
        const { couldWrite, serializedMesh, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("freeSurferBinaryWriteMesh successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("couldWrite", couldWrite)
        couldWriteOutputDownload.variant = "success"
        couldWriteOutputDownload.disabled = false
        const couldWriteDetails = document.getElementById("freeSurferBinaryWriteMesh-could-write-details")
        couldWriteDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(couldWrite, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        couldWriteDetails.disabled = false
        const couldWriteOutput = document.getElementById("freeSurferBinaryWriteMesh-could-write-details")

        model.outputs.set("serializedMesh", serializedMesh)
        serializedMeshOutputDownload.variant = "success"
        serializedMeshOutputDownload.disabled = false
        const serializedMeshOutput = document.getElementById("freeSurferBinaryWriteMesh-serialized-mesh-details")
        serializedMeshOutput.innerHTML = `<pre>${globalThis.escapeHtml(serializedMesh.data.subarray(0, 1024).toString() + ' ...')}</pre>`
        serializedMeshOutput.disabled = false
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
    const { couldWrite, serializedMesh, } = await meshIo.freeSurferBinaryWriteMesh(      this.model.inputs.get('mesh'),
      this.model.inputs.get('serializedMesh'),
      Object.fromEntries(this.model.options.entries())
    )

    return { couldWrite, serializedMesh, }
  }
}

const freeSurferBinaryWriteMeshController = new FreeSurferBinaryWriteMeshController(freeSurferBinaryWriteMeshLoadSampleInputs)
