import WebworkerPromise from 'webworker-promise'
import PromiseFileReader from 'promise-file-reader'

import config from './itkConfig'

const worker = new window.Worker(config.itkModulesPath + '/WebWorkers/MeshIO.worker.js')
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

export default readMeshFile
