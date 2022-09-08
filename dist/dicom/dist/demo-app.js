import { structuredReportToText } from '../dist/itk-dicom.js'

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

let appWebWorker = null

async function processFile(context, event) {
  const arrayBuffer = await readAsArrayBuffer(event.data)
  const dicomData = new Uint8Array(arrayBuffer)

  const { webWorker, outputText } = await structuredReportToText(appWebWorker, dicomData)
  appWebWorker = webWorker
  return outputText
}

function renderResults(context) {
  const outputTextArea = document.querySelector('textarea')
  if (context.processResult) {
    outputTextArea.textContent = context.processResult
  }
}

const demoAppMachine = XState.createMachine({
  id: 'demoApp',
  initial: 'idle',
  context: {
    processResult: null
  },
  states: {
    idle: {
      on: {
        UPLOAD_DATA: 'processing'
      },
    },
    processing: {
      invoke: {
        id: 'processFile',
        src: processFile,
        onDone: {
          target: "#demoApp.idle",
          actions: [
            XState.assign({
              processResult: (context, { data }) => { return data }
            }),
            renderResults,
          ]
        },
        onError: {
          actions: [
            (c, event) => {
              console.log(event)
              const message = `Could not process file: ${event.data.toString()}`
              console.error(message)
              alert(message)
            }
          ],
          target: 'idle',
        }
      }
    }
  }
})

const demoAppService = XState.interpret(demoAppMachine)
  .onTransition((state) => {
    console.log(state)
  })
  .start()

const fileInput = document.querySelector('input')
fileInput.addEventListener('change', (event) => {
  const dataTransfer = event.dataTransfer
  const files = event.target.files || dataTransfer.files

  demoAppService.send({ type: 'UPLOAD_DATA', data: files[0] })
})