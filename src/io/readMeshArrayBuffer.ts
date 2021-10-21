import createWebworkerPromise from '../core/internal/createWebworkerPromise.js'
import Mesh from '../core/Mesh.js'

import config from '../itkConfig.js'

import ReadMeshResult from './ReadMeshResult.js'

async function readMeshArrayBuffer (webWorker: Worker | null, arrayBuffer: ArrayBuffer, fileName: string, mimeType: string): Promise<ReadMeshResult> {
  let worker = webWorker
  return await createWebworkerPromise('mesh-io', worker)
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
      ).then(async function (mesh: Mesh) {
        return await Promise.resolve({ mesh, webWorker: worker })
      })
    })
}

export default readMeshArrayBuffer
