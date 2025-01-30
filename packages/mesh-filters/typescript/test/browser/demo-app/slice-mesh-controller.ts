// Generated file. To retain edits, remove this comment.

import { readMesh } from '@itk-wasm/mesh-io'
import { writeMesh } from '@itk-wasm/mesh-io'
import * as meshFilters from '../../../dist/index.js'
import sliceMeshLoadSampleInputs, { usePreRun } from "./slice-mesh-load-sample-inputs.js"

class SliceMeshModel {
  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
}


class SliceMeshController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new SliceMeshModel()
    const model = this.model

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#sliceMeshInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const inputMeshElement = document.querySelector('#sliceMeshInputs input[name=input-mesh-file]')
    inputMeshElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const { mesh, webWorker } = await readMesh(files[0])
        webWorker.terminate()
        model.inputs.set("inputMesh", mesh)
        const details = document.getElementById("sliceMesh-input-mesh-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(mesh, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        details.disabled = false
    })

    const planesElement = document.querySelector('#sliceMeshInputs input[name=planes-file]')
    planesElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const arrayBuffer = await files[0].arrayBuffer()
        model.inputs.set("planes", JSON.parse(new TextDecoder().decode(new Uint8Array(arrayBuffer))))
        const details = document.getElementById("sliceMesh-planes-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(model.inputs.get("planes"), globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        details.disabled = false
    })

    // ----------------------------------------------
    // Options
    // ----------------------------------------------
    // Outputs
    const polylinesOutputDownload = document.querySelector('#sliceMeshOutputs sl-button[name=polylines-download]')
    polylinesOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("polylines")) {
            const polylinesDownloadFormat = document.getElementById('sliceMesh-polylines-output-format')
            const downloadFormat = polylinesDownloadFormat.value || 'vtk'
            const fileName = `polylines.${downloadFormat}`
            const { webWorker, serializedMesh } = await writeMesh(model.outputs.get("polylines"), fileName)

            globalThis.downloadFile(serializedMesh.data, fileName)
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
      if (event.detail.name === 'sliceMesh-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'sliceMesh') {
          params.set('functionName', 'sliceMesh')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'sliceMesh' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'sliceMesh') {
        tabGroup.show('sliceMesh-panel')
        preRun()
      }
    }
    onInit()

    const runButton = document.querySelector('#sliceMeshInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('inputMesh')) {
        globalThis.notify("Required input not provided", "inputMesh", "danger", "exclamation-octagon")
        return
      }
      if(!model.inputs.has('planes')) {
        globalThis.notify("Required input not provided", "planes", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true

        const t0 = performance.now()
        const { polylines, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("sliceMesh successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("polylines", polylines)
        polylinesOutputDownload.variant = "success"
        polylinesOutputDownload.disabled = false
        const polylinesDetails = document.getElementById("sliceMesh-polylines-details")
        polylinesDetails.disabled = false
        polylinesDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(polylines, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
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
    const { polylines, } = await meshFilters.sliceMesh(      this.model.inputs.get('inputMesh'),
      this.model.inputs.get('planes'),
      Object.fromEntries(this.model.options.entries())
    )

    return { polylines, }
  }
}

const sliceMeshController = new SliceMeshController(sliceMeshLoadSampleInputs)
