import * as dicom from '../../../dist/bundles/dicom.js'
import readDicomEncapsulatedPdfLoadSampleInputs from "./read-dicom-encapsulated-pdf-load-sample-inputs.js"

class ReadDicomEncapsulatedPdfModel {

  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
  }


class ReadDicomEncapsulatedPdfController  {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new ReadDicomEncapsulatedPdfModel()
    const model = this.model

    this.webWorker = null

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#readDicomEncapsulatedPdfInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', (event) => {
        loadSampleInputs(model)
      })
    }

    // ----------------------------------------------
    // Inputs
    const dicomFileElement = document.querySelector('#readDicomEncapsulatedPdfInputs input[name=dicom-file-file]')
    dicomFileElement.addEventListener('change', (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        files[0].arrayBuffer().then((arrayBuffer) => {
            model.inputs.set("dicomFile", { data: new Uint8Array(arrayBuffer), path: files[0].name })
            const input = document.querySelector("#readDicomEncapsulatedPdfInputs sl-input[name=dicom-file]")
            input.value = model.inputs.get("dicomFile").data.subarray(0, 50).toString() + ' ...'
        })
    })

    // ----------------------------------------------
    // Options
    const readFileOnlyElement = document.querySelector('#readDicomEncapsulatedPdfInputs sl-checkbox[name=read-file-only]')
    readFileOnlyElement.addEventListener('sl-change', (event) => {
        model.options.set("readFileOnly", readFileOnlyElement.checked)
    })

    const readDatasetElement = document.querySelector('#readDicomEncapsulatedPdfInputs sl-checkbox[name=read-dataset]')
    readDatasetElement.addEventListener('sl-change', (event) => {
        model.options.set("readDataset", readDatasetElement.checked)
    })

    const readXferAutoElement = document.querySelector('#readDicomEncapsulatedPdfInputs sl-checkbox[name=read-xfer-auto]')
    readXferAutoElement.addEventListener('sl-change', (event) => {
        model.options.set("readXferAuto", readXferAutoElement.checked)
    })

    const readXferDetectElement = document.querySelector('#readDicomEncapsulatedPdfInputs sl-checkbox[name=read-xfer-detect]')
    readXferDetectElement.addEventListener('sl-change', (event) => {
        model.options.set("readXferDetect", readXferDetectElement.checked)
    })

    const readXferLittleElement = document.querySelector('#readDicomEncapsulatedPdfInputs sl-checkbox[name=read-xfer-little]')
    readXferLittleElement.addEventListener('sl-change', (event) => {
        model.options.set("readXferLittle", readXferLittleElement.checked)
    })

    const readXferBigElement = document.querySelector('#readDicomEncapsulatedPdfInputs sl-checkbox[name=read-xfer-big]')
    readXferBigElement.addEventListener('sl-change', (event) => {
        model.options.set("readXferBig", readXferBigElement.checked)
    })

    const readXferImplicitElement = document.querySelector('#readDicomEncapsulatedPdfInputs sl-checkbox[name=read-xfer-implicit]')
    readXferImplicitElement.addEventListener('sl-change', (event) => {
        model.options.set("readXferImplicit", readXferImplicitElement.checked)
    })

    const acceptOddLengthElement = document.querySelector('#readDicomEncapsulatedPdfInputs sl-checkbox[name=accept-odd-length]')
    acceptOddLengthElement.addEventListener('sl-change', (event) => {
        model.options.set("acceptOddLength", acceptOddLengthElement.checked)
    })

    const assumeEvenLengthElement = document.querySelector('#readDicomEncapsulatedPdfInputs sl-checkbox[name=assume-even-length]')
    assumeEvenLengthElement.addEventListener('sl-change', (event) => {
        model.options.set("assumeEvenLength", assumeEvenLengthElement.checked)
    })

    const enableCp246Element = document.querySelector('#readDicomEncapsulatedPdfInputs sl-checkbox[name=enable-cp246]')
    enableCp246Element.addEventListener('sl-change', (event) => {
        model.options.set("enableCp246", enableCp246Element.checked)
    })

    const disableCp246Element = document.querySelector('#readDicomEncapsulatedPdfInputs sl-checkbox[name=disable-cp246]')
    disableCp246Element.addEventListener('sl-change', (event) => {
        model.options.set("disableCp246", disableCp246Element.checked)
    })

    const retainUnElement = document.querySelector('#readDicomEncapsulatedPdfInputs sl-checkbox[name=retain-un]')
    retainUnElement.addEventListener('sl-change', (event) => {
        model.options.set("retainUn", retainUnElement.checked)
    })

    const convertUnElement = document.querySelector('#readDicomEncapsulatedPdfInputs sl-checkbox[name=convert-un]')
    convertUnElement.addEventListener('sl-change', (event) => {
        model.options.set("convertUn", convertUnElement.checked)
    })

    const enableCorrectionElement = document.querySelector('#readDicomEncapsulatedPdfInputs sl-checkbox[name=enable-correction]')
    enableCorrectionElement.addEventListener('sl-change', (event) => {
        model.options.set("enableCorrection", enableCorrectionElement.checked)
    })

    const disableCorrectionElement = document.querySelector('#readDicomEncapsulatedPdfInputs sl-checkbox[name=disable-correction]')
    disableCorrectionElement.addEventListener('sl-change', (event) => {
        model.options.set("disableCorrection", disableCorrectionElement.checked)
    })

    // ----------------------------------------------
    // Outputs
    const pdfBinaryOutputOutputDownload = document.querySelector('#readDicomEncapsulatedPdfOutputs sl-button[name=pdf-binary-output-download]')
    pdfBinaryOutputOutputDownload.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("pdfBinaryOutput")) {
            globalThis.downloadFile(model.outputs.get("pdfBinaryOutput"), "pdfBinaryOutput.bin")
        }
    })

    const pdfBinaryOutputs = document.getElementById('readDicomEncapsulatedPdfOutputs')
    const pdfBinaryDetails = document.createElement('sl-details')
    pdfBinaryDetails.summary = "Output pdf"
    pdfBinaryDetails.disabled = true
    pdfBinaryOutputs?.replaceChild(pdfBinaryDetails, pdfBinaryOutputs?.firstElementChild)
    pdfBinaryDetails.id = 'pdf-binary-output-details'

    const runButton = document.querySelector('#readDicomEncapsulatedPdfInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('dicomFile')) {
        globalThis.notify("Required input not provided", "dicomFile", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true
        const t0 = performance.now()

        const { webWorker, pdfBinaryOutput, } = await dicom.readDicomEncapsulatedPdf(this.webWorker,
          { data: model.inputs.get('dicomFile').data.slice(), path: model.inputs.get('dicomFile').path },
          Object.fromEntries(model.options.entries())
        )

        const t1 = performance.now()
        globalThis.notify("readDicomEncapsulatedPdf successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")
        this.webWorker = webWorker

        model.outputs.set("pdfBinaryOutput", pdfBinaryOutput)
        pdfBinaryOutputOutputDownload.variant = "success"
        pdfBinaryOutputOutputDownload.disabled = false

        const pdfUrl = URL.createObjectURL(new Blob([pdfBinaryOutput], {type: "application/pdf"}))
        pdfBinaryDetails.innerHTML = `<object data="${pdfUrl}" type="application/pdf" width="100%" height="500px"></object>`
        pdfBinaryDetails.disabled = false
        pdfBinaryDetails.open = true
      } catch (error) {
        globalThis.notify("Error while running pipeline", error.toString(), "danger", "exclamation-octagon")
        throw error
      } finally {
        runButton.loading = false
      }
    })
  }
}

const readDicomEncapsulatedPdfController = new ReadDicomEncapsulatedPdfController(readDicomEncapsulatedPdfLoadSampleInputs)
