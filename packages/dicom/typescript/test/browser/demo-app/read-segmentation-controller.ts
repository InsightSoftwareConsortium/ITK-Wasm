// Generated file. To retain edits, remove this comment.

import { writeImage } from '@itk-wasm/image-io'
import * as dicom from '../../../dist/index.js'
import readSegmentationLoadSampleInputs, { usePreRun } from "./read-segmentation-load-sample-inputs.js"

class ReadSegmentationModel {
  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
}


class ReadSegmentationController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new ReadSegmentationModel()
    const model = this.model

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#readSegmentationInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const dicomFileElement = document.querySelector('#readSegmentationInputs input[name=dicom-file-file]')
    dicomFileElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const arrayBuffer = await files[0].arrayBuffer()
        model.inputs.set("dicomFile", { data: new Uint8Array(arrayBuffer), path: files[0].name })
        const details = document.getElementById("readSegmentation-dicom-file-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(model.inputs.get("dicomFile").data.subarray(0, 50).toString() + ' ...')}</pre>`
        details.disabled = false
    })

    // ----------------------------------------------
    // Options
    // ----------------------------------------------
    // Outputs
    const segImageOutputDownload = document.querySelector('#readSegmentationOutputs sl-button[name=seg-image-download]')
    segImageOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("segImage")) {
            const segImageDownloadFormat = document.getElementById('readSegmentation-seg-image-output-format')
            const downloadFormat = segImageDownloadFormat.value || 'nrrd'
            const fileName = `segImage.${downloadFormat}`
            const { webWorker, serializedImage } = await writeImage(model.outputs.get("segImage"), fileName)

            webWorker.terminate()
            globalThis.downloadFile(serializedImage.data, fileName)
        }
    })

    const metaInfoOutputDownload = document.querySelector('#readSegmentationOutputs sl-button[name=meta-info-download]')
    metaInfoOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("metaInfo")) {
            const fileName = `metaInfo.json`
            globalThis.downloadFile(new TextEncoder().encode(JSON.stringify(model.outputs.get("metaInfo"))), fileName)
        }
    })

    const preRun = async () => {
      if (loadSampleInputs && usePreRun) {
        await loadSampleInputs(model, true)
        await this.run()
      }
    }

    const onSelectTab = async (event) => {
      if (event.detail.name === 'readSegmentation-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'readSegmentation') {
          params.set('functionName', 'readSegmentation')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'readSegmentation' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'readSegmentation') {
        tabGroup.show('readSegmentation-panel')
        preRun()
      }
    }
    onInit()

    const runButton = document.querySelector('#readSegmentationInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('dicomFile')) {
        globalThis.notify("Required input not provided", "dicomFile", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true

        const t0 = performance.now()
        const { segImage, metaInfo, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("readSegmentation successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("segImage", segImage)
        segImageOutputDownload.variant = "success"
        segImageOutputDownload.disabled = false
        const segImageDetails = document.getElementById("readSegmentation-seg-image-details")
        segImageDetails.disabled = false
        segImageDetails.setImage(segImage)

        model.outputs.set("metaInfo", metaInfo)
        metaInfoOutputDownload.variant = "success"
        metaInfoOutputDownload.disabled = false
        const metaInfoDetails = document.getElementById("readSegmentation-meta-info-details")
        metaInfoDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(metaInfo, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        metaInfoDetails.disabled = false
        const metaInfoOutput = document.getElementById("readSegmentation-meta-info-details")
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
    const { segImage, metaInfo, } = await dicom.readSegmentation(      { data: this.model.inputs.get('dicomFile').data.slice(), path: this.model.inputs.get('dicomFile').path },
      Object.fromEntries(this.model.options.entries())
    )

    return { segImage, metaInfo, }
  }
}

const readSegmentationController = new ReadSegmentationController(readSegmentationLoadSampleInputs)
