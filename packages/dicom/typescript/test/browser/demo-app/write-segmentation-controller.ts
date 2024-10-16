// Generated file. To retain edits, remove this comment.

import { readImage } from '@itk-wasm/image-io'
import * as dicom from '../../../dist/index.js'
import writeSegmentationLoadSampleInputs, { usePreRun } from "./write-segmentation-load-sample-inputs.js"

class WriteSegmentationModel {
  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
}


class WriteSegmentationController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new WriteSegmentationModel()
    const model = this.model

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#writeSegmentationInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const segImageElement = document.querySelector('#writeSegmentationInputs input[name=seg-image-file]')
    segImageElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const { image, webWorker } = await readImage(files[0])
        webWorker.terminate()
        model.inputs.set("segImage", image)
        const details = document.getElementById("writeSegmentation-seg-image-details")
        details.setImage(image)
        details.disabled = false
    })

    const metaInfoElement = document.querySelector('#writeSegmentationInputs input[name=meta-info-file]')
    metaInfoElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const arrayBuffer = await files[0].arrayBuffer()
        model.inputs.set("metaInfo", JSON.parse(new TextDecoder().decode(new Uint8Array(arrayBuffer))))
        const details = document.getElementById("writeSegmentation-meta-info-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(model.inputs.get("metaInfo"), globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        details.disabled = false
    })

    const outputDicomFileElement = document.querySelector('#writeSegmentationInputs sl-input[name=output-dicom-file]')
    outputDicomFileElement.addEventListener('sl-change', (event) => {
        model.inputs.set("outputDicomFile", outputDicomFileElement.value)
    })

    // ----------------------------------------------
    // Options
    const refDicomSeriesElement = document.querySelector('#writeSegmentationInputs input[name=ref-dicom-series-file]')
    refDicomSeriesElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const inputBinaries = await Promise.all(Array.from(files).map(async (file) => { const arrayBuffer = await file.arrayBuffer(); return { data: new Uint8Array(arrayBuffer), path: file.name } }))
        model.options.set("refDicomSeries", inputBinaries)
        const details = document.getElementById("writeSegmentation-ref-dicom-series-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(model.options.get("refDicomSeries").map((x) => x.path).toString())}</pre>`
        details.disabled = false
    })

    const skipEmptySlicesElement = document.querySelector('#writeSegmentationInputs sl-checkbox[name=skip-empty-slices]')
    skipEmptySlicesElement.addEventListener('sl-change', (event) => {
        model.options.set("skipEmptySlices", skipEmptySlicesElement.checked)
    })

    const useLabelidAsSegmentnumberElement = document.querySelector('#writeSegmentationInputs sl-checkbox[name=use-labelid-as-segmentnumber]')
    useLabelidAsSegmentnumberElement.addEventListener('sl-change', (event) => {
        model.options.set("useLabelidAsSegmentnumber", useLabelidAsSegmentnumberElement.checked)
    })

    // ----------------------------------------------
    // Outputs
    const outputDicomFileOutputDownload = document.querySelector('#writeSegmentationOutputs sl-button[name=output-dicom-file-download]')
    outputDicomFileOutputDownload.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("outputDicomFile")) {
            globalThis.downloadFile(model.outputs.get("outputDicomFile").data, model.outputs.get("outputDicomFile").path)
        }
    })

    const preRun = async () => {
      if (loadSampleInputs && usePreRun) {
        await loadSampleInputs(model, true)
        await this.run()
      }
    }

    const onSelectTab = async (event) => {
      if (event.detail.name === 'writeSegmentation-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'writeSegmentation') {
          params.set('functionName', 'writeSegmentation')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'writeSegmentation' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'writeSegmentation') {
        tabGroup.show('writeSegmentation-panel')
        preRun()
      }
    }
    onInit()

    const runButton = document.querySelector('#writeSegmentationInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('segImage')) {
        globalThis.notify("Required input not provided", "segImage", "danger", "exclamation-octagon")
        return
      }
      if(!model.inputs.has('metaInfo')) {
        globalThis.notify("Required input not provided", "metaInfo", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true

        const t0 = performance.now()
        const { outputDicomFile, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("writeSegmentation successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("outputDicomFile", outputDicomFile)
        outputDicomFileOutputDownload.variant = "success"
        outputDicomFileOutputDownload.disabled = false
        const outputDicomFileOutput = document.getElementById("writeSegmentation-output-dicom-file-details")
        outputDicomFileOutput.innerHTML = `<pre>${globalThis.escapeHtml(outputDicomFile.data.subarray(0, 1024).toString() + ' ...')}</pre>`
        outputDicomFileOutput.disabled = false
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
    const { outputDicomFile, } = await dicom.writeSegmentation(      this.model.inputs.get('segImage'),
      this.model.inputs.get('metaInfo'),
      this.model.inputs.get('outputDicomFile'),
      Object.fromEntries(this.model.options.entries())
    )

    return { outputDicomFile, }
  }
}

const writeSegmentationController = new WriteSegmentationController(writeSegmentationLoadSampleInputs)
