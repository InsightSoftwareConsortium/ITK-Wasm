const WebworkerPromise = require('webworker-promise')
const PromiseFileReader = require('promise-file-reader')

const config = require('./itkConfig.js')

const worker = new window.Worker(config.webWorkersPath + '/MeshIO.worker.js')
const promiseWorker = new WebworkerPromise(worker)

const readMeshFile = (file) => {
  return PromiseFileReader.readAsArrayBuffer(file)
    .then(arrayBuffer => {
      return promiseWorker.postMessage(
        {
          operation: 'readMesh',
          name: file.name,
          type: file.type,
          data: arrayBuffer,
          config: config
        },
        [arrayBuffer])
    })
}

module.exports = readMeshFile
