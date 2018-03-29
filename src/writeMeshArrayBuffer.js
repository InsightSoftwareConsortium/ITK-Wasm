import WebworkerPromise from 'webworker-promise'

import config from './itkConfig'

const worker = new window.Worker(config.itkModulesPath + '/WebWorkers/MeshIO.worker.js')
const promiseWorker = new WebworkerPromise(worker)

const writeMeshArrayBuffer = ({ useCompression, binaryFileType }, mesh, fileName, mimeType) => {
  const transferables = []
  if (mesh.points.buffer) {
    transferables.push(mesh.points.buffer)
  } else if (mesh.points.byteLength) {
    transferables.push(mesh.points)
  }
  if (mesh.pointData.buffer) {
    transferables.push(mesh.pointData.buffer)
  } else if (mesh.pointData.byteLength) {
    transferables.push(mesh.pointData)
  }
  if (mesh.cells.buffer) {
    transferables.push(mesh.cells.buffer)
  } else if (mesh.cells.byteLength) {
    transferables.push(mesh.cells)
  }
  if (mesh.cellData.buffer) {
    transferables.push(mesh.cellData.buffer)
  } else if (mesh.cellData.byteLength) {
    transferables.push(mesh.cellData)
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
