// Generated file. To retain edits, remove this comment.

import * as compressStringify from '../../../dist/bundles/compress-stringify.js'
import parseStringDecompressLoadSampleInputs, { usePreRun } from "./parse-string-decompress-load-sample-inputs.js"

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


class ParseStringDecompressController {

  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs

    this.model = new ParseStringDecompressModel()
    const model = this.model

    this.webWorker = null

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector("#parseStringDecompressInputs [name=loadSampleInputs]")
      loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
      loadSampleInputsButton.addEventListener('click', async (event) => {
        loadSampleInputsButton.loading = true
        await loadSampleInputs(model)
        loadSampleInputsButton.loading = false
      })
    }

    // ----------------------------------------------
    // Inputs
    const inputElement = document.querySelector('#parseStringDecompressInputs input[name=input-file]')
    inputElement.addEventListener('change', async (event) => {
        const dataTransfer = event.dataTransfer
        const files = event.target.files || dataTransfer.files

        const arrayBuffer = await files[0].arrayBuffer()
        model.inputs.set("input", new Uint8Array(arrayBuffer))
        const details = document.getElementById("parseStringDecompress-input-details")
        details.innerHTML = `<pre>${globalThis.escapeHtml(model.inputs.get("input").subarray(0, 50).toString() + ' ...')}</pre>`
        details.disabled = false
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

    const preRun = async () => {
      if (!this.webWorker && loadSampleInputs && usePreRun) {
        await loadSampleInputs(model, true)
        await this.run()
      }
    }

    const onSelectTab = async (event) => {
      if (event.detail.name === 'parseStringDecompress-panel') {
        const params = new URLSearchParams(window.location.search)
        if (!params.has('functionName') || params.get('functionName') !== 'parseStringDecompress') {
          params.set('functionName', 'parseStringDecompress')
          const url = new URL(document.location)
          url.search = params
          window.history.replaceState({ functionName: 'parseStringDecompress' }, '', url)
          await preRun()
        }
      }
    }

    const tabGroup = document.querySelector('sl-tab-group')
    tabGroup.addEventListener('sl-tab-show', onSelectTab)
    function onInit() {
      const params = new URLSearchParams(window.location.search)
      if (params.has('functionName') && params.get('functionName') === 'parseStringDecompress') {
        tabGroup.show('parseStringDecompress-panel')
        preRun()
      }
    }
    onInit()

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
        const { output, } = await this.run()
        const t1 = performance.now()
        globalThis.notify("parseStringDecompress successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")

        model.outputs.set("output", output)
        outputOutputDownload.variant = "success"
        outputOutputDownload.disabled = false
        const outputOutput = document.getElementById("parseStringDecompress-output-details")
        outputOutput.innerHTML = `<pre>${globalThis.escapeHtml(output.subarray(0, 1024).toString() + ' ...')}</pre>`
        outputOutput.disabled = false
      } catch (error) {
        globalThis.notify("Error while running pipeline", error.toString(), "danger", "exclamation-octagon")
        throw error
      } finally {
        runButton.loading = false
      }
    })
  }

  async run() {
    const { webWorker, output, } = await compressStringify.parseStringDecompress(this.webWorker,
      this.model.inputs.get('input').slice(),
      Object.fromEntries(this.model.options.entries())
    )
    this.webWorker = webWorker

    return { output, }
  }
}

const parseStringDecompressController = new ParseStringDecompressController(parseStringDecompressLoadSampleInputs)
