import WebworkerPromise from 'webworker-promise'

import config from './itkConfig'

const worker = new window.Worker(config.itkModulesPath + '/WebWorkers/MeshIO.worker.js')
const promiseWorker = new WebworkerPromise(worker)

const writeMeshArrayBuffer = ({ useCompression, binaryFileType }, mesh, fileName, mimeType) => {
  const transferables = []
  if (mesh.points.buffer) {
    transferables.push(mesh.points.buffer)
  }
  if (mesh.pointData.buffer) {
    transferables.push(mesh.pointData.buffer)
  }
  if (mesh.cells.buffer) {
    transferables.push(mesh.cells.buffer)
  }
  if (mesh.cellData.buffer) {
    transferables.push(mesh.cellData.buffer)
  }
  return promiseWorker.postMessage(
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
  )
}

export default writeMeshArrayBuffer
