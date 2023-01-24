import * as itkCompressStringify from '../../dist/bundles/itk-compress-stringify.js'

// Use local, vendored WebAssembly module assets
const pipelinesBaseUrl: string | URL = new URL('/pipelines', document.location.origin).href
itkCompressStringify.setPipelinesBaseUrl(pipelinesBaseUrl)
let pipelineWorkerUrl: string | URL | null = new URL('/web-workers/pipeline.worker.js', document.location.origin).href
itkCompressStringify.setPipelineWorkerUrl(pipelineWorkerUrl)


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

const packageFunctions = []
for (const [key, val] of Object.entries(itkCompressStringify)) {
  if (typeof val == 'function') {
    packageFunctions.push(key)
  }
}
packageFunctions.sort()

const pipelineFunctionsList = document.getElementById('pipeline-functions-list')
pipelineFunctionsList.innerHTML = packageFunctions.map((func => `<li><a href="#${func}-function">${func}</a></li>`)).join('\n')

function setupCompressStringify() {
  const context = {
    inputs: [],
    options: {},
    outputs: {},
  }

  const fileInput = document.querySelector('#compressStringifyInputs input[type=file]')
  fileInput.addEventListener('change', (event) => {
    const dataTransfer = event.dataTransfer
    const files = event.target.files || dataTransfer.files

    readAsArrayBuffer(files[0]).then((arrayBuffer) => {
      context.inputs[0] = new Uint8Array(arrayBuffer)
      const input = document.querySelector("#compressStringifyInputs [name=input]")
      input.value = context.inputs[0].toString()
    })
  })

  const stringify = document.querySelector("#compressStringifyInputs [name=stringify]")
  stringify.addEventListener('sl-change', () => {
    context.options.stringify = stringify.checked
  })

  const compressionLevel = document.querySelector("#compressStringifyInputs [name=compressionLevel]")
  compressionLevel.addEventListener('sl-change', () => {
    context.options.compressionLevel = parseInt(compressionLevel.value)
  })

  const dataUrlPrefix = document.querySelector("#compressStringifyInputs [name=dataUrlPrefix]")
  dataUrlPrefix.addEventListener('sl-change', () => {
    context.options.dataUrlPrefix = dataUrlPrefix.value
  })

  const loadSample = document.querySelector('#compressStringifyInputs sl-button[name=loadSample]')
  loadSample.addEventListener('click', () => {
    const sampleInput = new Uint8Array([222, 173, 190, 239])
    context.inputs[0] = sampleInput
    const input = document.querySelector("#compressStringifyInputs [name=input]")
    input.value = sampleInput.toString()

    context.options.stringify = true
    stringify.checked = true

    context.options.compressionLevel = 5
    compressionLevel.value = 5

    context.options.dataUrlPrefix = 'data:application/iwi+cbor+zstd;base64,'
    dataUrlPrefix.value = context.options.dataUrlPrefix
  })

  const downloadOutput = document.querySelector('#compressStringifyOutputs sl-button[name=downloadOutput]')
  downloadOutput.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (context.outputs.output) {
      const extension = context.options.stringify ? '.txt' : '.bin'
      downloadFile(context.outputs.output, `compressStringifyOutput${extension}`)
    }
  })

  const form = document.querySelector('#compressStringifyInputs form')
  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const { webWorker, output } = await itkCompressStringify.compressStringify(null, context.inputs[0].slice(), context.options)
    webWorker.terminate()

    context.outputs.output = output
    const outputTextArea = document.querySelector('#compressStringifyOutputs sl-textarea[name=output]')
    if (context.options.stringify) {
      outputTextArea.value = new TextDecoder().decode(output)

    } else {
      outputTextArea.value = output.toString()
    }
  })
}
setupCompressStringify()

function setupParseStringDecompress() {
  const context = {
    inputs: [],
    options: {},
    outputs: {},
  }

  const fileInput = document.querySelector('#parseStringDecompressInputs input[type=file]')
  fileInput.addEventListener('change', (event) => {
    const dataTransfer = event.dataTransfer
    const files = event.target.files || dataTransfer.files

    readAsArrayBuffer(files[0]).then((arrayBuffer) => {
      context.inputs[0] = new Uint8Array(arrayBuffer)
      const input = document.querySelector("#parseStringDecompressInputs [name=input]")
      input.value = context.inputs[0].toString()
    })
  })

  const parseString = document.querySelector("#parseStringDecompressInputs [name=parseString]")
  parseString.addEventListener('sl-change', () => {
    context.options.parseString = parseString.checked
  })

  const loadSample = document.querySelector('#parseStringDecompressInputs sl-button[name=loadSample]')
  loadSample.addEventListener('click', () => {
    const sampleInput = new TextEncoder().encode('data:application/iwi+cbor+zstd;base64,KLUv/SAEIQAA3q2+7w==')
    context.inputs[0] = sampleInput
    const input = document.querySelector("#parseStringDecompressInputs [name=input]")
    input.value = sampleInput.toString()

    context.options.parseString = true
    parseString.checked = true
  })

  const form = document.querySelector('#parseStringDecompressInputs form')
  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const { webWorker, output } = await itkCompressStringify.parseStringDecompress(null, context.inputs[0].slice(), context.options)
    webWorker.terminate()

    context.outputs.output = output
    const outputTextArea = document.querySelector('#parseStringDecompressOutputs sl-textarea[name=output]')
    outputTextArea.value = output.toString()
  })

  const downloadOutput = document.querySelector('#parseStringDecompressOutputs sl-button[name=downloadOutput]')
  downloadOutput.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (context.outputs.output) {
      downloadFile(context.outputs.output, 'parseStringDecompressOutput.bin')
    }
  })

}
setupParseStringDecompress()