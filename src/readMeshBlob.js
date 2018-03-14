import WebworkerPromise from 'webworker-promise'
import PromiseFileReader from 'promise-file-reader'

import config from './itkConfig'

const worker = new window.Worker(config.itkModulesPath + '/WebWorkers/MeshIO.worker.js')
const promiseWorker = new WebworkerPromise(worker)

const readMeshBlob = (blob, fileName, mimeType) => {
  return PromiseFileReader.readAsArrayBuffer(blob)
    .then(arrayBuffer => {
      return promiseWorker.postMessage({ operation: 'readMesh', name: fileName, type: mimeType, data: arrayBuffer, config: config },
        [arrayBuffer])
    })
}

export default readMeshBlob
