import WebworkerPromise from 'webworker-promise'
import PromiseFileReader from 'promise-file-reader'

import config from './itkConfig'

const readMeshBlob = (webWorker, blob, fileName, mimeType) => {
  let worker = webWorker
  if (!worker) {
    worker = new window.Worker(
      config.itkModulesPath + '/WebWorkers/MeshIO.worker.js'
    )
  }
  const promiseWorker = new WebworkerPromise(worker)
  return PromiseFileReader.readAsArrayBuffer(blob)
    .then(arrayBuffer => {
      return promiseWorker.postMessage({ operation: 'readMesh', name: fileName, type: mimeType, data: arrayBuffer, config: config },
        [arrayBuffer])
    }
    ).then(function (mesh) {
      return Promise.resolve({ mesh, webWorker: worker })
    })
}

export default readMeshBlob
