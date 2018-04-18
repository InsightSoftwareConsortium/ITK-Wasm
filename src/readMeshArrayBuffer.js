import WebworkerPromise from 'webworker-promise'

import config from './itkConfig'

const readMeshArrayBuffer = (webWorker, arrayBuffer, fileName, mimeType) => {
  let worker = webWorker
  if (!worker) {
    worker = new window.Worker(
      config.itkModulesPath + '/WebWorkers/MeshIO.worker.js'
    )
  }
  const promiseWorker = new WebworkerPromise(worker)
  return promiseWorker.postMessage(
    {
      operation: 'readMesh',
      name: fileName,
      type: mimeType,
      data: arrayBuffer,
      config
    },
    [arrayBuffer]
  ).then(function (mesh) {
    return Promise.resolve({ mesh, webWorker: worker })
  })
}

export default readMeshArrayBuffer
