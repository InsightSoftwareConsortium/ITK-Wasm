// Generated file. To retain edits, remove this comment.

import * as compressStringify from '../../../dist/bundles/compress-stringify.js'
import compressStringifyLoadSampleInputs from "./compress-stringify-load-sample-inputs.js"

function setupCompressStringify(loadSampleInputs)  {
  // Data context
  const context = {
    inputs: new Map(),
    options: new Map(),
    outputs: new Map(),
  }

  // ----------------------------------------------
  // Inputs

  if (loadSampleInputs) {
    const loadSampleInputsButton = document.querySelector("#compressStringifyInputs [name=loadSampleInputs]")
    loadSampleInputsButton.setAttribute('style', 'display: block-inline;')
    loadSampleInputsButton.addEventListener('click', (event) => {
      loadSampleInputs(context)
    })
  }

  const inputElement = document.querySelector('#compressStringifyInputs input[name=input-file]')
  inputElement.addEventListener('change', (event) => {
    const dataTransfer = event.dataTransfer
    const files = event.target.files || dataTransfer.files

    files[0].arrayBuffer().then((arrayBuffer) => {
      context.inputs.set("input", new Uint8Array(arrayBuffer))
      const input = document.querySelector("#compressStringifyInputs sl-input[name=input]")
      input.value = context.inputs.get("input").toString().substring(0, 50) + ' ...'
    })
  })

  // ----------------------------------------------
  // Options

  const stringifyElement = document.querySelector('#compressStringifyInputs sl-checkbox[name=stringify]')
  stringifyElement.addEventListener('sl-change', (event) => {
    context.options.set("stringify", stringifyElement.checked)
  })

  const compressionLevelElement = document.querySelector('#compressStringifyInputs sl-input[name=compression-level]')
  compressionLevelElement.addEventListener('sl-change', (event) => {
    context.options.set("compressionLevel", parseInt(compressionLevelElement.value))
  })

  const dataUrlPrefixElement = document.querySelector('#compressStringifyInputs sl-input[name=data-url-prefix]')
  dataUrlPrefixElement.addEventListener('sl-change', (event) => {
    context.options.set("dataUrlPrefix", dataUrlPrefixElement.value)
  })

  // ----------------------------------------------
  // Outputs

  const outputOutputDownload = document.querySelector('#compressStringifyOutputs sl-button[name=output-download]')
  outputOutputDownload.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (context.outputs.has("output")) {
      globalThis.downloadFile(context.outputs.get("output"), "output.bin")
    }
  })

  const form = document.querySelector(`#compressStringifyInputs form`)
  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    if(!context.inputs.has('input')) {
      globalThis.notify("Required input not provided", "input", "danger", "exclamation-octagon")
      return
    }

    const progressBar = document.querySelector('#compressStringifyInputs > form > sl-progress-bar')
    try {
      progressBar.setAttribute('style', 'visibility: default;')
      progressBar.indeterminate = true
      const t0 = performance.now()
      const { webWorker, output } = await compressStringify.compressStringify(null,
        context.inputs.get('input').slice(),
        Object.fromEntries(context.options.entries())
        )
      const t1 = performance.now()
      globalThis.notify("compressStringify successfully completed", `in ${t1 - t0} milliseconds.`, "success", "rocket-fill")
      webWorker.terminate()

      context.outputs.set("output", output)
      outputOutputDownload.variant = "success"
      outputOutputDownload.disabled = false
      const outputOutput = document.querySelector('#compressStringifyOutputs sl-textarea[name=output]')
      outputOutput.value = output.toString().substring(0, 200) + ' ...'
    } catch (error) {
      globalThis.notify("Error while running pipeline", error.toString(), "danger", "exclamation-octagon")
      throw error
    } finally {
      progressBar.indeterminate = false
      progressBar.setAttribute("style", "visibility: hidden;")
    }

  })
}
setupCompressStringify(compressStringifyLoadSampleInputs)
