import readImageArrayBuffer from './readImageArrayBuffer'
import readMeshArrayBuffer from './readMeshArrayBuffer'

import getFileExtension from './getFileExtension'
import extensionToMeshIO from './extensionToMeshIO'
import mimeToMeshIO from './MimeToMeshIO'

const readArrayBuffer = (webWorker, arrayBuffer, fileName, mimeType) => {
  const extension = getFileExtension(fileName)
  const isMesh = !!extensionToMeshIO.hasOwnProperty(extension) || !!mimeToMeshIO.hasOwnProperty(mimeType)
  if (isMesh) {
    return readMeshArrayBuffer(webWorker, arrayBuffer, fileName, mimeType)
      .catch(function () {
        webWorker.terminate()
        return readImageArrayBuffer(null, arrayBuffer, fileName, mimeType)
      })
  } else {
    return readImageArrayBuffer(webWorker, arrayBuffer, fileName, mimeType)
  }
}

export default readArrayBuffer
