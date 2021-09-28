import path from 'path'

import getFileExtension from './getFileExtension.js'
import extensionToMeshIO from './internal/extensionToMeshIO.js'

import writeImageLocalFileSync from './writeImageLocalFileSync.js'
import writeMeshLocalFileSync from './writeMeshLocalFileSync.js'

import Image from '../core/Image.js'
import Mesh from '../core/Mesh.js'

/**
 * Write an image or mesh to a file on the local filesystem in Node.js.
 *
 * @param: useCompression compression the pixel data when possible
 * @param: imageOrMesh itk.Image or itk.Mesh instance to write
 * @param: filePath path to the file on the local filesystem.
 *
 * @return null
 */
function writeLocalFileSync(useCompression: boolean, imageOrMesh: Image | Mesh, filePath: string): null {
  const absoluteFilePath = path.resolve(filePath)
  const extension = getFileExtension(absoluteFilePath)

  const isMesh = extensionToMeshIO.has(extension)
  if (isMesh) {
    try {
      writeMeshLocalFileSync({ useCompression }, imageOrMesh as Mesh, filePath)
      return null
    } catch (err) {
      // Was a .vtk image file? Continue to write as an image.
      writeImageLocalFileSync(useCompression, imageOrMesh as Image, filePath)
    }
  } else {
    writeImageLocalFileSync(useCompression, imageOrMesh as Image, filePath)
  }
  return null
}

export default writeLocalFileSync
