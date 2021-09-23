import createWebworkerPromise from "../core/internal/createWebworkerPromise.js"
import Mesh from "../core/Mesh.js"

import config from "../itkConfig.js"

import ReadMeshResult from "./ReadMeshResult.js"

function readMeshArrayBuffer(webWorker: Worker | null, arrayBuffer: ArrayBuffer, fileName: string, mimeType: string): Promise<ReadMeshResult> {
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
      ).then(function (mesh: Mesh) {
        return Promise.resolve({ mesh, webWorker: worker })
      })
    })
}

export default readMeshArrayBuffer
