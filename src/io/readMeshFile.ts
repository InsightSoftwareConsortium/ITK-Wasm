import createWebWorkerPromise from '../core/internal/createWebWorkerPromise.js'
import { readAsArrayBuffer } from 'promise-file-reader'

import Mesh from '../core/Mesh.js'

import config from '../itkConfig.js'

import ReadMeshResult from './ReadMeshResult.js'

async function readMeshFile (webWorker: Worker | null, file: File): Promise<ReadMeshResult> {
  let worker = webWorker
  const { webworkerPromise, worker: usedWorker } = await createWebWorkerPromise(
    'mesh-io',
    worker
  )
  worker = usedWorker
  const arrayBuffer = await readAsArrayBuffer(file)
  try {
    const mesh: Mesh = await webworkerPromise.postMessage(
      {
        operation: 'readMesh',
        name: file.name,
        type: file.type,
        data: arrayBuffer,
        config: config
      },
      [arrayBuffer]
    )
    return { mesh, webWorker: worker }
  } catch (error: any) {
    throw Error(error.toString())
  }
}

export default readMeshFile
