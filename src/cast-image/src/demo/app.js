import { castImage } from '../index.ts'
import { interpret, assign, createMachine } from 'xstate'


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

const structuredReportToTextOptions = new Map([
  ["unknownRelationship", "Accept unknown relationship type"],
  ["invalidItemValue", "Accept invalid content item value"],
  ["ignoreConstraints", "Ignore relationship constraints"],
  ["ignoreItemErrors", "Ignore content item errors"],
  ["skipInvalidItems", "Skip invalid content items"],
  ["noDocumentHeader", "Print no document header"],
  ["numberNestedItems", "Number nested items"],
  ["shortenLongValues", "Shorten long item values"],
  ["printInstanceUid", "Print SOP Instance UID"],
  ["printSopclassShort", "Print short SOP class name"],
  ["printSopclassLong", "Print SOP class name"],
  ["printSopclassUid", "Print long SOP class name"],
  ["printAllCodes", "Print all codes"],
  ["printInvalidCodes", "Print invalid codes"],
  ["printTemplateId", "Print template identification"],
  ["indicateEnhanced", "Indicate enhanced encoding mode"],
  ["printColor", "Use ANSI escape codes"],
])


function createOptionsElements(context, event) {
  context.options = {}
  const optionsChildren = []

  structuredReportToTextOptions.forEach((description, name) =>{
    context.options[name] = false
    const entryDiv = document.createElement("div")
    entryDiv.innerHTML = `<sp-checkbox name=${name} id=${name} ><label for="${name}">${description}</label></sp-checkbox>`
    entryDiv.addEventListener('click', (e) => {
      context.options[name] = !entryDiv.children[0].checked
      context.service.send({ type: 'PROCESS' })
    })
    optionsChildren.push(entryDiv)
  })

  const optionsDiv = document.getElementById("options")
  optionsDiv.replaceChildren(...optionsChildren)
}


async function loadData(context, event) {
  const arrayBuffer = await readAsArrayBuffer(event.data)
  const dicomData = new Uint8Array(arrayBuffer)

  return dicomData
}


let appWebWorker = null
async function processData(context, event) {
  if (!context.dicomData) {
    return
  }
  const outputTextArea = document.getElementById('outputTextArea')
  outputTextArea.innerText = "Processing..."
  const { webWorker, outputText } = await structuredReportToText(appWebWorker, context.dicomData.slice(), context.options)
  appWebWorker = webWorker
  return outputText
}


function renderResults(context) {
  const outputTextArea = document.getElementById('outputTextArea')
  if (context.processResult) {
    outputTextArea.innerText = context.processResult
  }
}


const context = {
  options: {},
  dicomData: null,
  processResult: null,
}

const demoAppMachine = createMachine({
  id: 'demoApp',
  initial: 'creatingOptions',
  context,
  states: {
    idle: {
      on: {
        UPLOAD_DATA: 'loadingData',
        PROCESS: 'processing',
      },
    },
    creatingOptions: {
      entry: createOptionsElements,
      always: { target: 'idle' }
    },
    loadingData: {
      invoke: {
        id: 'loadData',
        src: loadData,
        onDone: {
          actions: [
            assign({
              dicomData: (context, { data }) => { return data }
            }),
          ],
          target: "processing",
        },
        onError: {
          actions: [
            (c, event) => {
              const message = `Could not load data: ${event.data.toString()}`
              console.error(message)
              alert(message)
            }
          ],
          target: 'idle',
        }
      }
    },
    processing: {
      invoke: {
        id: 'processData',
        src: processData,
        onDone: {
          actions: [
            assign({
              processResult: (context, { data }) => { return data }
            }),
            renderResults,
          ],
          target: "idle",
        },
        onError: {
          actions: [
            (c, event) => {
              console.log(c, event)
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

const demoAppService = interpret(demoAppMachine)
context.service = demoAppService
demoAppService.start()


const fileInput = document.getElementById('inputFile')
fileInput.addEventListener('change', (event) => {
  const dataTransfer = event.dataTransfer
  const files = event.target.files || dataTransfer.files

  demoAppService.send({ type: 'UPLOAD_DATA', data: files[0] })
})

const dropzoneInput = document.getElementById('fileDropzone')
dropzoneInput.addEventListener('drop', (event) => {
  const files = event.dataTransfer.files

  demoAppService.send({ type: 'UPLOAD_DATA', data: files[0] })
})