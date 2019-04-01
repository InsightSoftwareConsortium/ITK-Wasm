import readImageFile from './readImageFile'
import readMeshFile from './readMeshFile'

import getFileExtension from './getFileExtension'
import extensionToMeshIO from './extensionToMeshIO'

const readFile = (webWorker, file) => {
  const extension = getFileExtension(file.name)
  const isMesh = extensionToMeshIO.hasOwnProperty(extension)
  if (isMesh) {
    return readMeshFile(webWorker, file)
      .catch(function () {
        webWorker.terminate()
        return readImageFile(null, file)
      })
  } else {
    return readImageFile(webWorker, file)
  }
}

export default readFile
