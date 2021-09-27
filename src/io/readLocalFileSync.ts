import path from 'path'

import getFileExtension from './getFileExtension.js'
import extensionToMeshIO from './internal/extensionToMeshIO.js'
import extensionToPolyDataIO from './internal/extensionToPolyDataIO.js'

import readImageLocalFileSync from './readImageLocalFileSync.js'
import readMeshLocalFileSync from './readMeshLocalFileSync.js'
import readPolyDataLocalFileSync from './readPolyDataLocalFileSync.js'

import Image from '../core/Image.js'
import Mesh from '../core/Mesh.js'
import PolyData from '../core/vtkPolyData.js'

/**
 * Read an image or mesh from a file on the local filesystem in Node.js.
 *
 * @param: filePath path to the file on the local filesystem.
 */
function readLocalFileSync(filePath: string): Image | Mesh | PolyData {
  const absoluteFilePath = path.resolve(filePath)
  const extension = getFileExtension(absoluteFilePath)

  const isMesh = extensionToMeshIO.has(extension)
  const isPolyData = extensionToPolyDataIO.has(extension)
  if (isMesh) {
    try {
      const mesh = readMeshLocalFileSync(filePath)
      return mesh
    } catch (err) {
      // Was a .vtk image file? Continue to read as an image.
      const image = readImageLocalFileSync(filePath)
      return image
    }
  } else if (isPolyData) {
    const polyData = readPolyDataLocalFileSync(filePath)
    return polyData
  } else {
    const image = readImageLocalFileSync(filePath)
    return image
  }
}

export default readLocalFileSync
