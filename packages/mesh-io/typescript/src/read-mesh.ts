import {
  BinaryFile,
  Mesh,
  getFileExtension,
} from 'itk-wasm'

import mimeToMeshIo from './mime-to-mesh-io.js'
import extensionToMeshIo from './extension-to-mesh-io.js'
import meshIoIndex from './mesh-io-index.js'

import ReadMeshOptions from './read-mesh-options.js'
import ReadMeshResult from './read-mesh-result.js'

interface ReaderResult {
  webWorker: Worker,
  couldRead: boolean,
  mesh: Mesh
}
interface ReaderOptions {
  /** Only read mesh metadata -- do not read pixel data. */
  informationOnly?: boolean
}
type Reader = (webWorker: null | Worker | boolean, serializedMesh: File | BinaryFile, options: ReaderOptions) => Promise<ReaderResult>

/**
 * Read a mesh file format and convert it to the itk-wasm file format
 *
 * @param {webWorker} null | webWorker - Web worker to run the pipeline or null to run it in a new worker
 * @param {File | BinaryFile} serializedMesh - Input mesh serialized in the file format
 * @param {ReadMeshOptions} options - options to cast the resulting mesh type or to only read mesh metadata
 *
 * @returns {Promise<ReadMeshResult>} - result object with the mesh and the web worker used
 */
async function readMesh(
  webWorker: null | Worker | boolean,
  serializedMesh: File | BinaryFile,
  options: ReadMeshOptions = {}
) : Promise<ReadMeshResult> {

  const mimeType = (serializedMesh as File).type ?? ''
  const fileName = (serializedMesh as File).name ?? (serializedMesh as BinaryFile).path ?? 'fileName'
  const extension = getFileExtension(fileName).toLowerCase()
  let usedWebWorker = webWorker

  let serializedMeshFile = serializedMesh as BinaryFile
  if (serializedMesh instanceof Blob) {
    const serializedMeshBuffer = await serializedMesh.arrayBuffer()
    serializedMeshFile = { path: serializedMesh.name, data: new Uint8Array(serializedMeshBuffer) }
  }

  let io = null
  if (mimeType && mimeToMeshIo.has(mimeType)) {
    io = mimeToMeshIo.get(mimeType)
  } else if (extensionToMeshIo.has(extension)) {
    io = extensionToMeshIo.get(extension)
  } else {
    for (const readerWriter of meshIoIndex.values()) {
      if (readerWriter[0] !== null) {
        let { webWorker: testWebWorker, couldRead, mesh } = await (readerWriter[0] as unknown as Reader)(usedWebWorker, { path: serializedMeshFile.path, data: serializedMeshFile.data.slice() }, { informationOnly: options.informationOnly })
        usedWebWorker = testWebWorker
        if (couldRead) {
          return { webWorker: usedWebWorker, mesh }
        }
      }
    }
  }
  if (!io) {
    throw Error('Could not find IO for: ' + fileName)
  }
  const readerWriter = meshIoIndex.get(io as string)

  const reader = (readerWriter as Array<Reader>)[0]
  let { webWorker: testWebWorker, couldRead, mesh } = await reader(usedWebWorker, serializedMeshFile, { informationOnly: options.informationOnly })
  usedWebWorker = testWebWorker
  if (!couldRead) {
    throw Error('Could not read: ' + fileName)
  }

  return { webWorker: usedWebWorker, mesh }
}

export default readMesh
