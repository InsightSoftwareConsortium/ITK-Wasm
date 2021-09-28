import path from 'path'

import getFileExtension from './getFileExtension.js'
import extensionToMeshIO from './internal/extensionToMeshIO.js'

import writeImageLocalFile from './writeImageLocalFile.js'
import writeMeshLocalFileSync from './writeMeshLocalFileSync.js'

import Mesh from '../core/Mesh.js'
import Image from '../core/Image.js'

/**
 * Write an image or mesh to a file on the local filesystem in Node.js.
 *
 * @param: useCompression compression the pixel data when possible
 * @param: imageOrMesh itk.Image or itk.Mesh instance to write
 * @param: filePath path to the file on the local filesystem.
 *
 * @return empty Promise
 */
function writeLocalFile(useCompression: boolean, imageOrMesh: Image | Mesh, filePath: string): Promise<null> {
  const absoluteFilePath = path.resolve(filePath)
  const extension = getFileExtension(absoluteFilePath)

  return new Promise(function (resolve, reject) {
    try {
      const isMesh = extensionToMeshIO.has(extension)
      if (isMesh) {
        try {
          writeMeshLocalFileSync({ useCompression }, imageOrMesh as Mesh, filePath)
          resolve(null)
        } catch (err) {
          // Was a .vtk image file? Continue to write as an image.
          writeImageLocalFile(useCompression, imageOrMesh as Image, filePath).then(() => {
            resolve(null)
          })
        }
      } else {
        writeImageLocalFile(useCompression, imageOrMesh as Image, filePath).then(() => {
          resolve(null)
        })
      }
    } catch (err) {
      reject(err)
    }
  })
}

export default writeLocalFile
