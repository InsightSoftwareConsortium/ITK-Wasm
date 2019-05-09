import writeImageArrayBuffer from './writeImageArrayBuffer'
import writeMeshArrayBuffer from './writeMeshArrayBuffer'

import getFileExtension from './getFileExtension'
import extensionToMeshIO from './extensionToMeshIO'
import mimeToMeshIO from './MimeToMeshIO'

const writeArrayBuffer = (webWorker, useCompression, imageOrMesh, fileName, mimeType) => {
  const extension = getFileExtension(fileName)
  const isMesh = !!extensionToMeshIO.hasOwnProperty(extension) || !!mimeToMeshIO.hasOwnProperty(mimeType)
  if (isMesh) {
    return writeMeshArrayBuffer(webWorker, useCompression, imageOrMesh, fileName, mimeType)
      .catch(function () {
        webWorker.terminate()
        return writeImageArrayBuffer(null, useCompression, imageOrMesh, fileName, mimeType)
      })
  } else {
    return writeImageArrayBuffer(webWorker, useCompression, imageOrMesh,
      fileName, mimeType)
  }
}

export default writeArrayBuffer
