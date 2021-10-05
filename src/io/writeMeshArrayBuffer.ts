import createWebworkerPromise from '../core/internal/createWebworkerPromise.js'

import config from '../itkConfig.js'

import Mesh from '../core/Mesh.js'

import WriteArrayBufferResult from './WriteArrayBufferResult.js'
import WriteMeshOptions from './WriteMeshOptions.js'

function writeMeshArrayBuffer(webWorker: Worker | null, options: WriteMeshOptions, mesh: Mesh, fileName: string, mimeType: string): Promise<WriteArrayBufferResult> {
  let worker = webWorker
  return createWebworkerPromise('mesh-io', worker)
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
      let useCompression = false
      if(typeof options.useCompression !== 'undefined') {
        useCompression = options.useCompression
      }
      let binaryFileType = false
      if(typeof options.binaryFileType !== 'undefined') {
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
      ).then(function (arrayBuffer: ArrayBuffer) {
        return Promise.resolve({ arrayBuffer, webWorker: worker })
      })
    })
}

export default writeMeshArrayBuffer
