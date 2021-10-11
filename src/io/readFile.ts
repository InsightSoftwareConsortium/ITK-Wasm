import readImageFile from './readImageFile.js'
import readMeshFile from './readMeshFile.js'
import readPolyDataFile from './readPolyDataFile.js'

import getFileExtension from './getFileExtension.js'
import extensionToMeshIO from './internal/extensionToMeshIO.js'
import extensionToPolyDataIO from './internal/extensionToPolyDataIO.js'

import ReadImageResult from "./ReadImageResult.js"
import ReadMeshResult from "./ReadMeshResult.js"
import ReadPolyDataResult from "./ReadPolyDataResult.js"

async function readFile(webWorker: Worker | null, file: File): Promise<ReadImageResult | ReadMeshResult | ReadPolyDataResult> {
  const extension = getFileExtension(file.name)
  const isMesh = extensionToMeshIO.has(extension)
  const isPolyData = extensionToPolyDataIO.has(extension)
  if (isMesh) {
    try {
      const result = await readMeshFile(webWorker, file)
      return result
    } catch (unused) {
      if (webWorker) {
        webWorker.terminate()
      }
      return readImageFile(null, file)
    }
  } else if (isPolyData) {
    return readPolyDataFile(webWorker, file)
  } else {
    return readImageFile(webWorker, file)
  }
}

export default readFile
