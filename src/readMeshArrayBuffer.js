import WebworkerPromise from 'webworker-promise'

import config from './itkConfig'

const worker = new window.Worker(config.itkModulesPath + '/WebWorkers/MeshIO.worker.js')
const promiseWorker = new WebworkerPromise(worker)

const readMeshArrayBuffer = (arrayBuffer, fileName, mimeType) => {
  return promiseWorker.postMessage({ operation: 'readMesh', name: fileName, type: mimeType, data: arrayBuffer, config: config },
    [arrayBuffer])
}

export default readMeshArrayBuffer
