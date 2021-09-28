import writeImageArrayBuffer from './writeImageArrayBuffer.js'
import writeMeshArrayBuffer from './writeMeshArrayBuffer.js'

import getFileExtension from './getFileExtension.js'
import extensionToMeshIO from './internal/extensionToMeshIO.js'
import mimeToMeshIO from './internal/MimeToMeshIO.js'

import Image from '../core/Image.js'
import Mesh from '../core/Mesh.js'

import WriteArrayBufferResult from './WriteArrayBufferResult.js'

function writeArrayBuffer(webWorker: Worker | null, useCompression: boolean, imageOrMesh: Image | Mesh, fileName: string, mimeType: string): Promise<WriteArrayBufferResult> {
  const extension = getFileExtension(fileName)
  const isMesh = !!extensionToMeshIO.has(extension) || !!mimeToMeshIO.has(mimeType)
  if (isMesh) {
    return writeMeshArrayBuffer(webWorker, { useCompression }, imageOrMesh as Mesh, fileName, mimeType)
      .catch(function () {
        if (webWorker) {
          webWorker.terminate()
        }
        return writeImageArrayBuffer(null, useCompression, imageOrMesh as Image, fileName, mimeType)
      })
  } else {
    return writeImageArrayBuffer(webWorker, useCompression, imageOrMesh as Image, fileName, mimeType)
  }
}

export default writeArrayBuffer
