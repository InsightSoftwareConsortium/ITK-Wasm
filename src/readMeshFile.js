import createWebworkerPromise from './createWebworkerPromise'
import PromiseFileReader from 'promise-file-reader'

import config from './itkConfig'

const readMeshFile = (webWorker, file) => {
  let worker = webWorker
  return createWebworkerPromise('MeshIO', worker)
    .then(({ webworkerPromise, worker: usedWorker }) => {
      worker = usedWorker
      return PromiseFileReader.readAsArrayBuffer(file)
        .then(arrayBuffer => {
          return webworkerPromise.postMessage(
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
    })
}

export default readMeshFile
