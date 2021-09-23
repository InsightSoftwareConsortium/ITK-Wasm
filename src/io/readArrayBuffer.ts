import readImageArrayBuffer from './readImageArrayBuffer.js'
import readMeshArrayBuffer from './readMeshArrayBuffer.js'

import getFileExtension from './getFileExtension.js'
import extensionToMeshIO from './extensionToMeshIO.js'
import mimeToMeshIO from './MimeToMeshIO.js'

import ReadImageResult from "./ReadImageResult.js"
import ReadMeshResult from "./ReadMeshResult.js"
import ReadPolyDataResult from "./ReadPolyDataResult.js"

function readArrayBuffer(webWorker: Worker | null, arrayBuffer: ArrayBuffer, fileName: string, mimeType: string): Promise<ReadImageResult | ReadMeshResult | ReadPolyDataResult> {
  const extension = getFileExtension(fileName)
  const isMesh = !!extensionToMeshIO.has(extension) || !!mimeToMeshIO.has(mimeType)
  if (isMesh) {
    return readMeshArrayBuffer(webWorker, arrayBuffer, fileName, mimeType)
      .catch(function () {
        if (webWorker) {
          webWorker.terminate()
        }
        return readImageArrayBuffer(null, arrayBuffer, fileName, mimeType)
      })
  } else {
    return readImageArrayBuffer(webWorker, arrayBuffer, fileName, mimeType)
  }
}

export default readArrayBuffer
