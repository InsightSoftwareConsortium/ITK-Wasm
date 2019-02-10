import createWebworkerPromise from './createWebworkerPromise'

import config from './itkConfig'

const readMeshArrayBuffer = (webWorker, arrayBuffer, fileName, mimeType) => {
  let worker = webWorker
  return createWebworkerPromise('MeshIO', worker)
    .then(({ webworkerPromise, worker: usedWorker }) => {
      worker = usedWorker
      return webworkerPromise.postMessage(
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
    })
}

export default readMeshArrayBuffer
