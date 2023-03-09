import * as @bindgenBundleNameCamelCase@ from '../../dist/bundles/@bindgenBundleName@.js'

// Use local, vendored WebAssembly module assets
const pipelinesBaseUrl: string | URL = new URL('/pipelines', document.location.origin).href
@bindgenBundleNameCamelCase@.setPipelinesBaseUrl(pipelinesBaseUrl)
const pipelineWorkerUrl: string | URL | null = new URL('/web-workers/pipeline.worker.js', document.location.origin).href
@bindgenBundleNameCamelCase@.setPipelineWorkerUrl(pipelineWorkerUrl)


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

@bindgenFunctionLogic@