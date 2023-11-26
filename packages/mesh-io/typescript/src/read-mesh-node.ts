import path from 'path'
import mime from 'mime-types'

import {
  Mesh,
  getFileExtension,
} from 'itk-wasm'

import mimeToMeshIo from './mime-to-mesh-io.js'
import extensionToMeshIo from './extension-to-mesh-io.js'
import meshIoIndexNode from './mesh-io-index-node.js'

import ReadMeshOptions from './read-mesh-options.js'

interface ReaderResult {
  couldRead: boolean,
  mesh: Mesh
}
interface ReaderOptions {
  /** Only read image metadata -- do not read pixel data. */
  informationOnly?: boolean
}
type Reader = (serializedMesh: string, options: ReaderOptions) => Promise<ReaderResult>


/**
 * Read a mesh file format and convert it to the itk-wasm file format
 *
 * @param {string} serializedMesh - Path to input mesh serialized in the file format
 * @param {ReadMeshOptions} options - options to cast resulting mesh type or to only read mesh metadata
 *
 * @returns {Promise<Mesh>} - Mesh result
 */
async function readMeshNode(
  serializedMesh: string,
  options: ReadMeshOptions = {}
) : Promise<Mesh> {

  const absoluteFilePath = path.resolve(serializedMesh)
  const mimeType = mime.lookup(absoluteFilePath)
  const extension = getFileExtension(absoluteFilePath)

  let io = null
  if (mimeType && mimeToMeshIo.has(mimeType)) {
    io = mimeToMeshIo.get(mimeType)
  } else if (extensionToMeshIo.has(extension)) {
    io = extensionToMeshIo.get(extension)
  } else {
    for (const readerWriter of meshIoIndexNode.values()) {
      if (readerWriter[0] !== null) {
        let { couldRead, mesh } = await (readerWriter[0] as Reader)(absoluteFilePath, { informationOnly: options.informationOnly })
        if (couldRead) {
          return mesh
        }
      }
    }
  }
  if (io === null ) {
    throw Error('Could not find IO for: ' + absoluteFilePath)
  }
  const readerWriter = meshIoIndexNode.get(io as string)

  const reader = (readerWriter as Array<Reader>)[0]
  let { couldRead, mesh } = await reader(absoluteFilePath, { informationOnly: options.informationOnly })
  if (!couldRead) {
    throw Error('Could not read: ' + absoluteFilePath)
  }

  return mesh
}

export default readMeshNode
