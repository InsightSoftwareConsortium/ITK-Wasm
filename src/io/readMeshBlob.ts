import { readAsArrayBuffer } from 'promise-file-reader'

import createWebWorkerPromise from '../core/internal/createWebWorkerPromise.js'

import Mesh from '../core/Mesh.js'

import config from '../itkConfig.js'

import ReadMeshResult from './ReadMeshResult.js'

async function readMeshBlob (webWorker: Worker | null, blob: Blob, fileName: string, mimeType: string): Promise<ReadMeshResult> {
  let worker = webWorker
  return await createWebWorkerPromise('mesh-io', worker)
    .then(async ({ webworkerPromise, worker: usedWorker }) => {
      worker = usedWorker
      return await readAsArrayBuffer(blob)
        .then(arrayBuffer => {
          return webworkerPromise.postMessage({ operation: 'readMesh', name: fileName, type: mimeType, data: arrayBuffer, config: config },
            [arrayBuffer])
        }
        ).then(async function (mesh: Mesh) {
          return await Promise.resolve({ mesh, webWorker: worker as Worker })
        })
    })
}

export default readMeshBlob
