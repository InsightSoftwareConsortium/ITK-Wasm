import {
  Mesh,
  BinaryFile,
  getFileExtension,
} from 'itk-wasm'

import mimeToMeshIo from './mime-to-mesh-io.js'
import extensionToMeshIo from './extension-to-mesh-io.js'
import meshIoIndex from './mesh-io-index.js'
import WriteMeshOptions from './write-mesh-options.js'
import WriteMeshResult from './write-mesh-result.js'

interface WriterOptions {
  informationOnly?: boolean
  useCompression?: boolean
  /** WebWorker for computation. Set to null to create a new worker. Or, pass an existing worker. Or, set to `false` to run in the current thread / worker. */
  webWorker?: Worker | null | boolean
}
interface WriterResult {
  webWorker: Worker
  couldWrite: boolean
  serializedMesh: BinaryFile
}
type Writer = (mesh: Mesh, serializedMesh: string, options: WriterOptions) => Promise<WriterResult>

/**
 * Write an itk-wasm Mesh converted to an serialized mesh file format
 *
 * @param {Mesh} mesh - Input mesh
 * @param {string} serializedMesh - Output mesh serialized in the file format.
 * @param {WriteMeshOptions} options - options object
 *
 * @returns {Promise<WriteMeshResult>} - result object
 */
async function writeMesh(
  mesh: Mesh,
  serializedMesh: string,
  options: WriteMeshOptions = {}
) : Promise<WriteMeshResult> {

  let inputMesh = mesh

  const mimeType = options.mimeType
  const extension = getFileExtension(serializedMesh).toLowerCase()
  let usedWebWorker = options.webWorker

  let io = null
  if (typeof mimeType !== 'undefined' && mimeToMeshIo.has(mimeType)) {
    io = mimeToMeshIo.get(mimeType)
  } else if (extensionToMeshIo.has(extension)) {
    io = extensionToMeshIo.get(extension)
  } else {
    for (const readerWriter of meshIoIndex.values()) {
      if (readerWriter[1] !== null) {
        let { webWorker: testWebWorker, couldWrite, serializedMesh: serializedMeshBuffer } = await (readerWriter[1] as unknown as Writer)(inputMesh, serializedMesh, options)
        usedWebWorker = testWebWorker
        if (couldWrite) {
          return { webWorker: usedWebWorker as Worker, serializedMesh: serializedMeshBuffer }
        }
      }
    }
  }
  if (!io) {
    throw Error('Could not find IO for: ' + serializedMesh)
  }
  const readerWriter = meshIoIndex.get(io as string)

  const writer = (readerWriter as Array<Writer>)[1]
  let { webWorker: testWebWorker, couldWrite, serializedMesh: serializedMeshBuffer } = await writer(inputMesh, serializedMesh, options)
  usedWebWorker = testWebWorker
  if (!couldWrite) {
    throw Error('Could not write: ' + serializedMesh)
  }

  const result = {
    webWorker: usedWebWorker as Worker,
    serializedMesh: serializedMeshBuffer
  }
  return result
}

export default writeMesh
