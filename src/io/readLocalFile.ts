import path from 'path'

import getFileExtension from './getFileExtension.js'
import extensionToMeshIO from './internal/extensionToMeshIO.js'
import extensionToPolyDataIO from './internal/extensionToPolyDataIO.js'

import readImageLocalFile from './readImageLocalFile.js'
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
function readLocalFile(filePath: string): Promise<Image | Mesh | PolyData> {
  const absoluteFilePath = path.resolve(filePath)
  const extension = getFileExtension(absoluteFilePath)

  return new Promise(function (resolve, reject) {
    try {
      const isMesh = extensionToMeshIO.has(extension)
      const isPolyData = extensionToPolyDataIO.has(extension)
      if (isMesh) {
        try {
          const mesh = readMeshLocalFileSync(filePath)
          resolve(mesh)
        } catch (err) {
          // Was a .vtk image file? Continue to read as an image.
          readImageLocalFile(filePath).then((image) => {
            resolve(image)
          })
        }
      } else if (isPolyData) {
        const polyData = readPolyDataLocalFileSync(filePath)
        resolve(polyData)
      } else {
        readImageLocalFile(filePath).then((image) => {
          resolve(image)
        })
      }
    } catch (err) {
      reject(err)
    }
  })
}

export default readLocalFile
