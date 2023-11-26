import path from 'path'

import {
  Mesh,
  getFileExtension,
} from 'itk-wasm'

import mimeToMeshIo from './mime-to-mesh-io.js'
import extensionToMeshIo from './extension-to-mesh-io.js'
import meshIoIndexNode from './mesh-io-index-node.js'

import WriteMeshOptions from './write-mesh-options.js'

interface WriterOptions {
  useCompression?: boolean
  binaryFileType?: boolean
}
interface WriterResult {
  couldWrite: boolean
}
type Writer = (mesh: Mesh, serializedImage: string, options: WriterOptions) => Promise<WriterResult>


/**
 * Write a mesh to a serialized file format and from an the itk-wasm Mesh
 *
 * @param {Mesh} mesh - Input mesh
 * @param {string} serializedMesh - Output mesh serialized in the file format.
 * @param {WriteMeshOptions} options - options object
 *
 * @returns {void} - result object
 */
async function writeMeshNode(
  mesh: Mesh,
  serializedMesh: string,
  options: WriteMeshOptions = {}
) : Promise<void> {
  const absoluteFilePath = path.resolve(serializedMesh)
  const mimeType = options.mimeType
  const extension = getFileExtension(absoluteFilePath)

  let inputMesh = mesh

  let io = null
  if (typeof mimeType !== 'undefined' && mimeToMeshIo.has(mimeType)) {
    io = mimeToMeshIo.get(mimeType)
  } else if (extensionToMeshIo.has(extension)) {
    io = extensionToMeshIo.get(extension)
  } else {
    for (const readerWriter of meshIoIndexNode.values()) {
      if (readerWriter[1] !== null) {
        let { couldWrite } = await (readerWriter[1] as Writer)(inputMesh, absoluteFilePath, { useCompression: options.useCompression, binaryFileType: options.binaryFileType })
        if (couldWrite) {
          return
        }
      }
    }
  }
  if (io === null ) {
    throw Error('Could not find IO for: ' + absoluteFilePath)
  }
  const readerWriter = meshIoIndexNode.get(io as string)

  const writer = (readerWriter as Array<Writer>)[1]
  let { couldWrite } = await writer(inputMesh, absoluteFilePath, { useCompression: options.useCompression })
  if (!couldWrite) {
    throw Error('Could not write: ' + absoluteFilePath)
  }
}

export default writeMeshNode
