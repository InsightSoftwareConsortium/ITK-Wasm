import * as compressStringify from '../../dist/bundles/compress-stringify.js'

// Use local, vendored WebAssembly module assets
const pipelinesBaseUrl: string | URL = new URL('/pipelines', document.location.origin).href
compressStringify.setPipelinesBaseUrl(pipelinesBaseUrl)
const pipelineWorkerUrl: string | URL | null = new URL('/web-workers/pipeline.worker.js', document.location.origin).href
compressStringify.setPipelineWorkerUrl(pipelineWorkerUrl)


// ------------------------------------------------------------------------------------
// Utilities

// promise-file-reader
function readAsArrayBuffer (file) {
  if (!(file instanceof Blob)) {
    throw new TypeError('Must be a File or Blob')
  }
  return new Promise(function(resolve, reject) {
    var reader = new FileReader()
    reader.onload = function(e) { resolve(e.target.result) }
    reader.onerror = function(e) { reject(new Error('Error reading' + file.name + ': ' + e.target.result)) }
    reader['readAsArrayBuffer'](file)
  })
}

function downloadFile(content, filename) {
  const url = URL.createObjectURL(new Blob([content]))
  const a = document.createElement('a')
  a.href = url
  a.download = filename || 'download'
  document.body.appendChild(a)
  function clickHandler(event) {
    setTimeout(() => {
      URL.revokeObjectURL(url)
      a.removeEventListener('click', clickHandler)
    }, 200)
  };
  a.addEventListener('click', clickHandler, false)
  a.click()
  return a
}


// ------------------------------------------------------------------------------------
// compressStringify
//
function setupCompressStringify(loadSampleInputsDefined, loadSampleInputs)  {
  // Data context
  const context = {
    inputs: new Map(),
    options: new Map(),
    outputs: new Map(),
  }

  // Inputs
  const inputInput = document.querySelector('#compressStringifyInputs input[name=input-file]')
  inputInput.addEventListener('change', (event) => {
    const dataTransfer = event.dataTransfer
    const files = event.target.files || dataTransfer.files

    readAsArrayBuffer(files[0]).then((arrayBuffer) => {
      context.inputs.set("input", new Uint8Array(arrayBuffer))
      const input = document.querySelector("#compressStringifyInputs [name=input]")
      input.value = context.inputs.get("input").toString()
    })
  })

  // Options
  const stringifyInput = document.querySelector('#compressStringifyInputs sl-checkbox[name=stringify]')
  stringifyInput.addEventListener('sl-change', (event) => {
    context.options.set("stringify", stringifyInput.checked)
  })

  const compressionLevelInput = document.querySelector('#compressStringifyInputs sl-input[name=compression-level]')
  compressionLevelInput.addEventListener('sl-change', (event) => {
    context.options.set("compression-level", parseInt(compressionLevelInput.value))
  })

  const dataUrlPrefixInput = document.querySelector('#compressStringifyInputs sl-input[name=data-url-prefix]')
  dataUrlPrefixInput.addEventListener('sl-change', (event) => {
    context.options.set("data-url-prefix", dataUrlPrefixInput.value)
  })


  if (loadSampleInputsDefined) {
    const loadSampleInputsButton = document.querySelector("#compressStringifyInputs [name=loadSampleInputs]")
    loadSampleInputsButton.setAttribute('style', 'visibility: visible;')
    loadSampleInputsButton.addEventListener('click', (event) => {
      loadSampleInputs(context)
    })
  }}
import { compressStringifyLoadSampleInputs, compressStringifyLoadSampleInputsDefined } from "./compressStringifyLoadSampleInputs.js"
setupCompressStringify(compressStringifyLoadSampleInputsDefined, compressStringifyLoadSampleInputs)

// ------------------------------------------------------------------------------------
// parseStringDecompress
//
function setupParseStringDecompress(loadSampleInputsDefined, loadSampleInputs)  {
  // Data context
  const context = {
    inputs: new Map(),
    options: new Map(),
    outputs: new Map(),
  }

  // Inputs
  const inputInput = document.querySelector('#parseStringDecompressInputs input[name=input-file]')
  inputInput.addEventListener('change', (event) => {
    const dataTransfer = event.dataTransfer
    const files = event.target.files || dataTransfer.files

    readAsArrayBuffer(files[0]).then((arrayBuffer) => {
      context.inputs.set("input", new Uint8Array(arrayBuffer))
      const input = document.querySelector("#parseStringDecompressInputs [name=input]")
      input.value = context.inputs.get("input").toString()
    })
  })

  // Options
  const parseStringInput = document.querySelector('#parseStringDecompressInputs sl-checkbox[name=parse-string]')
  parseStringInput.addEventListener('sl-change', (event) => {
    context.options.set("parse-string", parseStringInput.checked)
  })


  if (loadSampleInputsDefined) {
    const loadSampleInputsButton = document.querySelector("#parseStringDecompressInputs [name=loadSampleInputs]")
    loadSampleInputsButton.setAttribute('style', 'visibility: visible;')
    loadSampleInputsButton.addEventListener('click', (event) => {
      loadSampleInputs(context)
    })
  }}
import { parseStringDecompressLoadSampleInputs, parseStringDecompressLoadSampleInputsDefined } from "./parseStringDecompressLoadSampleInputs.js"
setupParseStringDecompress(parseStringDecompressLoadSampleInputsDefined, parseStringDecompressLoadSampleInputs)
