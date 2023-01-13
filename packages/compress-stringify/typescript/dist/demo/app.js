import * as itkCompressStringify from '../itk-compress-stringify.js'


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

const packageFunctions = []
for (const [key, val] of Object.entries(itkCompressStringify)) {
  if (typeof val == 'function') {
    packageFunctions.push(key)
  }
}

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

  const form = document.querySelector('#compressStringifyInputs form')
  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    console.log(context)
    
    const { webWorker, output } = await itkCompressStringify.compressStringify(null, ...context.inputs, context.options)
    console.log(webWorker)
    console.log(output)
    context.outputs.output = output
  })
}

setupCompressStringify()