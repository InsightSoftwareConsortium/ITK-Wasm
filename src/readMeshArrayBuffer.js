const WebworkerPromise = require('webworker-promise')

const config = require('./itkConfig.js')

const worker = new window.Worker(config.webWorkersPath + '/MeshIO.worker.js')
const promiseWorker = new WebworkerPromise(worker)

const readMeshArrayBuffer = (arrayBuffer, fileName, mimeType) => {
  return promiseWorker.postMessage({ operation: 'readMesh', name: fileName, type: mimeType, data: arrayBuffer, config: config },
    [arrayBuffer])
}

module.exports = readMeshArrayBuffer
