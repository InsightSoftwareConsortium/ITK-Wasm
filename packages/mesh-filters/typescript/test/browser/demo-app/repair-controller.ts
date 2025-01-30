// Generated file. To retain edits, remove this comment.

import { readMesh } from '@itk-wasm/mesh-io'
import { writeMesh } from '@itk-wasm/mesh-io'
import * as meshFilters from '../../../dist/index.js'
import repairLoadSampleInputs, { usePreRun } from "./repair-load-sample-inputs.js"

class RepairModel {
  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
}


class RepairController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new RepairModel()
    const model = this.model

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#repairInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const inputMeshElement = document.querySelector('#repairInputs input[name=input-mesh-file]')
    inputMeshElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const { mesh, webWorker } = await readMesh(files[0])
        webWorker.terminate()
        model.inputs.set("inputMesh", mesh)
        const details = document.getElementById("repair-input-mesh-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(mesh, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        details.disabled = false
    })

    // ----------------------------------------------
    // Options
    const mergeToleranceElement = document.querySelector('#repairInputs sl-input[name=merge-tolerance]')
    mergeToleranceElement.addEventListener('sl-change', (event) => {
        model.options.set("mergeTolerance", parseFloat(mergeToleranceElement.value))
    })

    const minimumComponentAreaElement = document.querySelector('#repairInputs sl-input[name=minimum-component-area]')
    minimumComponentAreaElement.addEventListener('sl-change', (event) => {
        model.options.set("minimumComponentArea", parseFloat(minimumComponentAreaElement.value))
    })

    const maximumHoleAreaElement = document.querySelector('#repairInputs sl-input[name=maximum-hole-area]')
    maximumHoleAreaElement.addEventListener('sl-change', (event) => {
        model.options.set("maximumHoleArea", parseFloat(maximumHoleAreaElement.value))
    })

    const maximumHoleEdgesElement = document.querySelector('#repairInputs sl-input[name=maximum-hole-edges]')
    maximumHoleEdgesElement.addEventListener('sl-change', (event) => {
        model.options.set("maximumHoleEdges", parseInt(maximumHoleEdgesElement.value))
    })

    const maximumDegree3DistanceElement = document.querySelector('#repairInputs sl-input[name=maximum-degree3-distance]')
    maximumDegree3DistanceElement.addEventListener('sl-change', (event) => {
        model.options.set("maximumDegree3Distance", parseFloat(maximumDegree3DistanceElement.value))
    })

    const removeIntersectingTrianglesElement = document.querySelector('#repairInputs sl-checkbox[name=remove-intersecting-triangles]')
    removeIntersectingTrianglesElement.addEventListener('sl-change', (event) => {
        model.options.set("removeIntersectingTriangles", removeIntersectingTrianglesElement.checked)
    })

    // ----------------------------------------------
    // Outputs
    const outputMeshOutputDownload = document.querySelector('#repairOutputs sl-button[name=output-mesh-download]')
    outputMeshOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("outputMesh")) {
            const outputMeshDownloadFormat = document.getElementById('repair-output-mesh-output-format')
            const downloadFormat = outputMeshDownloadFormat.value || 'vtk'
            const fileName = `outputMesh.${downloadFormat}`
            const { webWorker, serializedMesh } = await writeMesh(model.outputs.get("outputMesh"), fileName)

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
      if (event.detail.name === 'repair-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'repair') {
          params.set('functionName', 'repair')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'repair' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'repair') {
        tabGroup.show('repair-panel')
        preRun()
      }
    }
    onInit()

    const runButton = document.querySelector('#repairInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('inputMesh')) {
        globalThis.notify("Required input not provided", "inputMesh", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true

        const t0 = performance.now()
        const { outputMesh, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("repair successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("outputMesh", outputMesh)
        outputMeshOutputDownload.variant = "success"
        outputMeshOutputDownload.disabled = false
        const outputMeshDetails = document.getElementById("repair-output-mesh-details")
        outputMeshDetails.disabled = false
        outputMeshDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(outputMesh, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
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
    const { outputMesh, } = await meshFilters.repair(      this.model.inputs.get('inputMesh'),
      Object.fromEntries(this.model.options.entries())
    )

    return { outputMesh, }
  }
}

const repairController = new RepairController(repairLoadSampleInputs)
