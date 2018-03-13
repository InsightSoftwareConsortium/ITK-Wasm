const WebworkerPromise = require('webworker-promise')
const PromiseFileReader = require('promise-file-reader')

const config = require('./itkConfig.js')

const worker = new window.Worker(config.webWorkersPath + '/MeshIO.worker.js')
const promiseWorker = new WebworkerPromise(worker)

const readMeshBlob = (blob, fileName, mimeType) => {
  return PromiseFileReader.readAsArrayBuffer(blob)
    .then(arrayBuffer => {
      return promiseWorker.postMessage({ operation: 'readMesh', name: fileName, type: mimeType, data: arrayBuffer, config: config },
        [arrayBuffer])
    })
}

module.exports = readMeshBlob
