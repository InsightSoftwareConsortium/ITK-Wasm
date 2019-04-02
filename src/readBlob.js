import readImageBlob from './readImageBlob'
import readMeshBlob from './readMeshBlob'

import getFileExtension from './getFileExtension'
import extensionToMeshIO from './extensionToMeshIO'
import mimeToMeshIO from './MimeToMeshIO'

const readBlob = (webWorker, blob, fileName, mimeType) => {
  const extension = getFileExtension(fileName)
  const isMesh = !!extensionToMeshIO.hasOwnProperty(extension) || !!mimeToMeshIO.hasOwnProperty(mimeType)
  if (isMesh) {
    return readMeshBlob(webWorker, blob, fileName, mimeType)
      .catch(function () {
        webWorker.terminate()
        return readImageBlob(null, blob, fileName, mimeType)
      })
  } else {
    return readImageBlob(webWorker, blob, fileName, mimeType)
  }
}

export default readBlob
