import { readAsArrayBuffer } from 'promise-file-reader'

import createWebworkerPromise from "../core/internal/createWebworkerPromise.js"

import Mesh from "../core/Mesh.js"

import config from "../itkConfig.js"

import ReadMeshResult from "./ReadMeshResult.js"

function readMeshBlob(webWorker: Worker | null, blob: Blob, fileName: string, mimeType: string): Promise<ReadMeshResult> {
  let worker = webWorker
  return createWebworkerPromise('MeshIO', worker)
    .then(({ webworkerPromise, worker: usedWorker }) => {
      worker = usedWorker
      return readAsArrayBuffer(blob)
        .then(arrayBuffer => {
          return webworkerPromise.postMessage({ operation: 'readMesh', name: fileName, type: mimeType, data: arrayBuffer, config: config },
            [arrayBuffer])
        }
        ).then(function (mesh: Mesh) {
          return Promise.resolve({ mesh, webWorker: worker as Worker })
        })
    })
}

export default readMeshBlob
