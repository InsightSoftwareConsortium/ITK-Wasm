import createWebworkerPromise from './createWebworkerPromise'

import config from './itkConfig'

const writeMeshArrayBuffer = (webWorker, { useCompression, binaryFileType }, mesh, fileName, mimeType) => {
  let worker = webWorker
  return createWebworkerPromise('MeshIO', worker)
    .then(({ webworkerPromise, worker: usedWorker }) => {
      worker = usedWorker
      const transferables = []
      if (mesh.points) {
        transferables.push(mesh.points.buffer)
      }
      if (mesh.pointData) {
        transferables.push(mesh.pointData.buffer)
      }
      if (mesh.cells) {
        transferables.push(mesh.cells.buffer)
      }
      if (mesh.cellData) {
        transferables.push(mesh.cellData.buffer)
      }
      return webworkerPromise.postMessage(
        {
          operation: 'writeMesh',
          name: fileName,
          type: mimeType,
          mesh,
          useCompression,
          binaryFileType,
          config
        },
        transferables
      ).then(function (arrayBuffer) {
        return Promise.resolve({ arrayBuffer, webWorker: worker })
      })
    })
}

export default writeMeshArrayBuffer
