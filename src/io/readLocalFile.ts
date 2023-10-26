import path from 'path'

import getFileExtension from './getFileExtension.js'
import extensionToMeshIO from './extensionToMeshIO.js'

import readImageLocalFile from './readImageLocalFile.js'
import readMeshLocalFile from './readMeshLocalFile.js'

import Image from '../core/interface-types/image.js'
import Mesh from '../core/interface-types/mesh.js'

/**
 * Read an image or mesh from a file on the local filesystem in Node.js.
 *
 * @param: filePath path to the file on the local filesystem.
 */
async function readLocalFile (filePath: string): Promise<Image | Mesh> {
  const absoluteFilePath = path.resolve(filePath)
  const extension = getFileExtension(absoluteFilePath)

  const isMesh = extensionToMeshIO.has(extension)
  if (isMesh) {
    try {
      const mesh = await readMeshLocalFile(filePath)
      return mesh
    } catch (err) {
      // Was a .vtk image file? Continue to read as an image.
      const image = await readImageLocalFile(filePath)
      return image
    }
  } else {
    const image = await readImageLocalFile(filePath)
    return image
  }
}

export default readLocalFile
