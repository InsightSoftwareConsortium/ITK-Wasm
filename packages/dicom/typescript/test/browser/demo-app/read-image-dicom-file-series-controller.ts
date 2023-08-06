// Generated file. To retain edits, remove this comment.

import { writeImageArrayBuffer, copyImage } from 'itk-wasm'
import * as dicom from '../../../dist/bundles/dicom.js'
import readImageDicomFileSeriesLoadSampleInputs from "./read-image-dicom-file-series-load-sample-inputs.js"

class ReadImageDicomFileSeriesModel {

  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
  }


class ReadImageDicomFileSeriesController  {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new ReadImageDicomFileSeriesModel()
    const model = this.model

    this.webWorker = null

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#readImageDicomFileSeriesInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', (event) => {
        loadSampleInputs(model)
      })
    }

    // ----------------------------------------------
    // Inputs
    // ----------------------------------------------
    // Options
    const inputImagesElement = document.querySelector('#readImageDicomFileSeriesInputs input[name=input-images-file]')
    inputImagesElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const inputBinaries = await Promise.all(Array.from(files).map(async (file) => { const arrayBuffer = await file.arrayBuffer(); return { data: new Uint8Array(arrayBuffer), path: file.name } }))
        model.options.set("inputImages", inputBinaries)
        const input = document.querySelector("#readImageDicomFileSeriesInputs sl-input[name=input-images]")
        input.value = model.options.get("inputImages").map((x) => x.path).toString()
    })

    const singleSortedSeriesElement = document.querySelector('#readImageDicomFileSeriesInputs sl-checkbox[name=single-sorted-series]')
    singleSortedSeriesElement.addEventListener('sl-change', (event) => {
        model.options.set("singleSortedSeries", singleSortedSeriesElement.checked)
    })

    // ----------------------------------------------
    // Outputs
    const outputImageOutputDownload = document.querySelector('#readImageDicomFileSeriesOutputs sl-button[name=output-image-download]')
    outputImageOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("outputImage")) {
            const outputImageDownloadFormat = document.getElementById('output-image-output-format')
            const downloadFormat = outputImageDownloadFormat.value || 'nrrd'
            const fileName = `outputImage.${downloadFormat}`
            const { webWorker, arrayBuffer } = await writeImageArrayBuffer(null, copyImage(model.outputs.get("outputImage")), fileName)

            webWorker.terminate()
            globalThis.downloadFile(arrayBuffer, fileName)
        }
    })

    const sortedFilenamesOutputDownload = document.querySelector('#readImageDicomFileSeriesOutputs sl-button[name=sorted-filenames-download]')
    sortedFilenamesOutputDownload.addEventListener('click', async (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("sortedFilenames")) {
            const fileName = `sortedFilenames.json`
            globalThis.downloadFile(new TextEncoder().encode(JSON.stringify(model.outputs.get("sortedFilenames"))), fileName)
        }
    })

    const runButton = document.querySelector('#readImageDicomFileSeriesInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()



      try {
        runButton.loading = true
        const t0 = performance.now()

        const { webWorker, outputImage, sortedFilenames, } = await dicom.readImageDicomFileSeries(this.webWorker,
          Object.fromEntries(model.options.entries())
        )

        const t1 = performance.now()
        globalThis.notify("readImageDicomFileSeries successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")
        this.webWorker = webWorker

        model.outputs.set("outputImage", outputImage)
        outputImageOutputDownload.variant = "success"
        outputImageOutputDownload.disabled = false
        const outputImageDetails = document.getElementById("output-image-output")
        outputImageDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(outputImage, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        outputImageDetails.disabled = false
        const outputImageOutput = document.querySelector('#readImageDicomFileSeriesOutputs sl-details[name=output-image]')

        model.outputs.set("sortedFilenames", sortedFilenames)
        sortedFilenamesOutputDownload.variant = "success"
        sortedFilenamesOutputDownload.disabled = false
        const sortedFilenamesDetails = document.getElementById("sorted-filenames-output")
        sortedFilenamesDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(sortedFilenames, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`
        sortedFilenamesDetails.disabled = false
        const sortedFilenamesOutput = document.querySelector('#readImageDicomFileSeriesOutputs sl-details[name=sorted-filenames]')
      } catch (error) {
        globalThis.notify("Error while running pipeline", error.toString(), "danger", "exclamation-octagon")
        throw error
      } finally {
        runButton.loading = false
      }
    })
  }
}

const readImageDicomFileSeriesController = new ReadImageDicomFileSeriesController(readImageDicomFileSeriesLoadSampleInputs)
