// Generated file. To retain edits, remove this comment.

import * as compressStringify from '../../../dist/bundles/compress-stringify.js'
import parseStringDecompressLoadSampleInputs from "./parse-string-decompress-load-sample-inputs.js"

function setupParseStringDecompress(loadSampleInputs)  {
  // Data context
  const context = {
    inputs: new Map(),
    options: new Map(),
    outputs: new Map(),
  }

  // ----------------------------------------------
  // Inputs

  if (loadSampleInputs) {
    const loadSampleInputsButton = document.querySelector("#parseStringDecompressInputs [name=loadSampleInputs]")
    loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
    loadSampleInputsButton.addEventListener('click', (event) => {
      loadSampleInputs(context)
    })
  }

  const inputElement = document.querySelector('#parseStringDecompressInputs input[name=input-file]')
  inputElement.addEventListener('change', (event) => {
    const dataTransfer = event.dataTransfer
    const files = event.target.files || dataTransfer.files

    files[0].arrayBuffer().then((arrayBuffer) => {
      context.inputs.set("input", new Uint8Array(arrayBuffer))
      const input = document.querySelector("#parseStringDecompressInputs sl-input[name=input]")
      input.value = context.inputs.get("input").toString().substring(0, 50) + ' ...'
    })
  })

  // ----------------------------------------------
  // Options

  const parseStringElement = document.querySelector('#parseStringDecompressInputs sl-checkbox[name=parse-string]')
  parseStringElement.addEventListener('sl-change', (event) => {
    context.options.set("parseString", parseStringElement.checked)
  })

  // ----------------------------------------------
  // Outputs

  const outputOutputDownload = document.querySelector('#parseStringDecompressOutputs sl-button[name=output-download]')
  outputOutputDownload.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (context.outputs.has("output")) {
      globalThis.downloadFile(context.outputs.get("output"), "output.bin")
    }
  })

  const form = document.querySelector(`#parseStringDecompressInputs form`)
  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    if(!context.inputs.has('input')) {
      globalThis.notify("Required input not provided", "input", "danger", "exclamation-octagon")
      return
    }

    const runButton = document.querySelector('#parseStringDecompressInputs sl-button[name="run"]')
    try {
      runButton.loading = true
      const t0 = performance.now()
      const { webWorker, output } = await compressStringify.parseStringDecompress(null,
        context.inputs.get('input').slice(),
        Object.fromEntries(context.options.entries())
        )
      const t1 = performance.now()
      globalThis.notify("parseStringDecompress successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")
      webWorker.terminate()

      context.outputs.set("output", output)
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
setupParseStringDecompress(parseStringDecompressLoadSampleInputs)
