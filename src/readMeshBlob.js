import createWebworkerPromise from './createWebworkerPromise'
import PromiseFileReader from 'promise-file-reader'

import config from './itkConfig'

const readMeshBlob = (webWorker, blob, fileName, mimeType) => {
  let worker = webWorker
  return createWebworkerPromise('MeshIO', worker)
    .then(({ webworkerPromise, worker: usedWorker }) => {
      worker = usedWorker
      return PromiseFileReader.readAsArrayBuffer(blob)
        .then(arrayBuffer => {
          return webworkerPromise.postMessage({ operation: 'readMesh', name: fileName, type: mimeType, data: arrayBuffer, config: config },
            [arrayBuffer])
        }
        ).then(function (mesh) {
          return Promise.resolve({ mesh, webWorker: worker })
        })
    })
}

export default readMeshBlob
