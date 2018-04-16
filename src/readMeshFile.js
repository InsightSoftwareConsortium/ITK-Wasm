import WebworkerPromise from 'webworker-promise'
import PromiseFileReader from 'promise-file-reader'

import config from './itkConfig'

const readMeshFile = (webWorker, file) => {
  let worker = webWorker
  if (!worker) {
    worker = new window.Worker(
      config.itkModulesPath + '/WebWorkers/MeshIO.worker.js'
    )
  }
  const promiseWorker = new WebworkerPromise(worker)
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
    }
    ).then(function (mesh) {
      return Promise.resolve({ mesh, webWorker: worker })
    })
}

export default readMeshFile
