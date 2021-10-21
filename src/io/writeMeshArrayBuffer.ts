import createWebworkerPromise from '../core/internal/createWebworkerPromise.js'

import config from '../itkConfig.js'

import Mesh from '../core/Mesh.js'

import WriteArrayBufferResult from './WriteArrayBufferResult.js'
import WriteMeshOptions from './WriteMeshOptions.js'

async function writeMeshArrayBuffer (webWorker: Worker | null, options: WriteMeshOptions, mesh: Mesh, fileName: string, mimeType: string): Promise<WriteArrayBufferResult> {
  let worker = webWorker
  return await createWebworkerPromise('mesh-io', worker)
    .then(({ webworkerPromise, worker: usedWorker }) => {
      worker = usedWorker
      const transferables = []
      if (mesh.points != null) {
        transferables.push(mesh.points.buffer)
      }
      if (mesh.pointData != null) {
        transferables.push(mesh.pointData.buffer)
      }
      if (mesh.cells != null) {
        transferables.push(mesh.cells.buffer)
      }
      if (mesh.cellData != null) {
        transferables.push(mesh.cellData.buffer)
      }
      let useCompression = false
      if (typeof options.useCompression !== 'undefined') {
        useCompression = options.useCompression
      }
      let binaryFileType = false
      if (typeof options.binaryFileType !== 'undefined') {
        binaryFileType = options.binaryFileType
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
      ).then(async function (arrayBuffer: ArrayBuffer) {
        return await Promise.resolve({ arrayBuffer, webWorker: worker })
      })
    })
}

export default writeMeshArrayBuffer
