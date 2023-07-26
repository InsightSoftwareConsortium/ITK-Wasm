// Generated file. To retain edits, remove this comment.

import * as compressStringify from '../../../dist/bundles/compress-stringify.js'
import parseStringDecompressLoadSampleInputs from "./parse-string-decompress-load-sample-inputs.js"

class ParseStringDecompressModel {

  inputs: Map<string, any>
  options: Map<string, any>
  outputs: Map<string, any>

  constructor() {
    this.inputs = new Map()
    this.options = new Map()
    this.outputs = new Map()
    }
  }


class ParseStringDecompressController  {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new ParseStringDecompressModel()
    const model = this.model

    this.webWorker = null

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#parseStringDecompressInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', (event) => {
        loadSampleInputs(model)
      })
    }

    // ----------------------------------------------
    // Inputs
    const inputElement = document.querySelector('#parseStringDecompressInputs input[name=input-file]')
    inputElement.addEventListener('change', (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        files[0].arrayBuffer().then((arrayBuffer) => {
            model.inputs.set("input", new Uint8Array(arrayBuffer))
            const input = document.querySelector("#parseStringDecompressInputs sl-input[name=input]")
            input.value = model.inputs.get("input").toString().substring(0, 50) + ' ...'
        })
    })

    // ----------------------------------------------
    // Options
    const parseStringElement = document.querySelector('#parseStringDecompressInputs sl-checkbox[name=parse-string]')
    parseStringElement.addEventListener('sl-change', (event) => {
        model.options.set("parseString", parseStringElement.checked)
    })

    // ----------------------------------------------
    // Outputs
    const outputOutputDownload = document.querySelector('#parseStringDecompressOutputs sl-button[name=output-download]')
    outputOutputDownload.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (model.outputs.has("output")) {
            globalThis.downloadFile(model.outputs.get("output"), "output.bin")
        }
    })

    const runButton = document.querySelector('#parseStringDecompressInputs sl-button[name="run"]')
    runButton.addEventListener('click', async (event) => {
      event.preventDefault()

      if(!model.inputs.has('input')) {
        globalThis.notify("Required input not provided", "input", "danger", "exclamation-octagon")
        return
      }


      try {
        runButton.loading = true
        const t0 = performance.now()

        const { webWorker, output } = await compressStringify.parseStringDecompress(this.webWorker,
          model.inputs.get('input').slice(),
          Object.fromEntries(model.options.entries())
        )

        const t1 = performance.now()
        globalThis.notify("parseStringDecompress successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")
        this.webWorker = webWorker

        model.outputs.set("output", output)
        outputOutputDownload.variant = "success"
        outputOutputDownload.disabled = false
        const outputOutput = document.querySelector('#parseStringDecompressOutputs sl-textarea[name=output]')
        outputOutput.value = output.toString().substring(0, 200) + ' ...'
      } catch (error) {
        globalThis.notify("Error while running pipeline", error.toString(), "danger", "exclamation-octagon")
        throw error
      } finally {
        runButton.loading = false
      }
    })
  }
}

const parseStringDecompressController = new ParseStringDecompressController(parseStringDecompressLoadSampleInputs)
