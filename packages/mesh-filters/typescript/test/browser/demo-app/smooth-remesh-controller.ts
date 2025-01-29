// Generated file. To retain edits, remove this comment.

import { readMesh } from '@itk-wasm/mesh-io'
import { writeMesh } from '@itk-wasm/mesh-io'
import * as meshFilters from '../../../dist/index.js'
import smoothRemeshLoadSampleInputs, { usePreRun } from "./smooth-remesh-load-sample-inputs.js"

class SmoothRemeshModel {
  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
}


class SmoothRemeshController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new SmoothRemeshModel()
    const model = this.model

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#smoothRemeshInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const inputMeshElement = document.querySelector('#smoothRemeshInputs input[name=input-mesh-file]')
    inputMeshElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const { mesh, webWorker } = await readMesh(files[0])
        webWorker.terminate()
        model.inputs.set("inputMesh", mesh)
        const details = document.getElementById("smoothRemesh-input-mesh-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(mesh, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        details.disabled = false
    })

    // ----------------------------------------------
    // Options
    const numberPointsElement = document.querySelector('#smoothRemeshInputs sl-input[name=number-points]')
    numberPointsElement.addEventListener('sl-change', (event) => {
        model.options.set("numberPoints", parseFloat(numberPointsElement.value))
    })

    const triangleShapeAdaptationElement = document.querySelector('#smoothRemeshInputs sl-input[name=triangle-shape-adaptation]')
    triangleShapeAdaptationElement.addEventListener('sl-change', (event) => {
        model.options.set("triangleShapeAdaptation", parseFloat(triangleShapeAdaptationElement.value))
    })

    const triangleSizeAdaptationElement = document.querySelector('#smoothRemeshInputs sl-input[name=triangle-size-adaptation]')
    triangleSizeAdaptationElement.addEventListener('sl-change', (event) => {
        model.options.set("triangleSizeAdaptation", parseFloat(triangleSizeAdaptationElement.value))
    })

    const normalIterationsElement = document.querySelector('#smoothRemeshInputs sl-input[name=normal-iterations]')
    normalIterationsElement.addEventListener('sl-change', (event) => {
        model.options.set("normalIterations", parseInt(normalIterationsElement.value))
    })

    const lloydIterationsElement = document.querySelector('#smoothRemeshInputs sl-input[name=lloyd-iterations]')
    lloydIterationsElement.addEventListener('sl-change', (event) => {
        model.options.set("lloydIterations", parseInt(lloydIterationsElement.value))
    })

    const newtonIterationsElement = document.querySelector('#smoothRemeshInputs sl-input[name=newton-iterations]')
    newtonIterationsElement.addEventListener('sl-change', (event) => {
        model.options.set("newtonIterations", parseInt(newtonIterationsElement.value))
    })

    const newtonMElement = document.querySelector('#smoothRemeshInputs sl-input[name=newton-m]')
    newtonMElement.addEventListener('sl-change', (event) => {
        model.options.set("newtonM", parseInt(newtonMElement.value))
    })

    const lfsSamplesElement = document.querySelector('#smoothRemeshInputs sl-input[name=lfs-samples]')
    lfsSamplesElement.addEventListener('sl-change', (event) => {
        model.options.set("lfsSamples", parseInt(lfsSamplesElement.value))
    })

    // ----------------------------------------------
    // Outputs
    const outputMeshOutputDownload = document.querySelector('#smoothRemeshOutputs sl-button[name=output-mesh-download]')
    outputMeshOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("outputMesh")) {
            const outputMeshDownloadFormat = document.getElementById('smoothRemesh-output-mesh-output-format')
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
      if (event.detail.name === 'smoothRemesh-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'smoothRemesh') {
          params.set('functionName', 'smoothRemesh')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'smoothRemesh' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'smoothRemesh') {
        tabGroup.show('smoothRemesh-panel')
        preRun()
      }
    }
    onInit()

    const runButton = document.querySelector('#smoothRemeshInputs sl-button[name="run"]')
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
        globalThis.notify("smoothRemesh successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("outputMesh", outputMesh)
        outputMeshOutputDownload.variant = "success"
        outputMeshOutputDownload.disabled = false
        const outputMeshDetails = document.getElementById("smoothRemesh-output-mesh-details")
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
    const { outputMesh, } = await meshFilters.smoothRemesh(      this.model.inputs.get('inputMesh'),
      Object.fromEntries(this.model.options.entries())
    )

    return { outputMesh, }
  }
}

const smoothRemeshController = new SmoothRemeshController(smoothRemeshLoadSampleInputs)
