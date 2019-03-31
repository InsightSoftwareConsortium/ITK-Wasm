const path = require('path')

const getFileExtension = require('./getFileExtension.js')
const extensionToMeshIO = require('./extensionToMeshIO.js')

const readImageLocalFileSync = require('./readImageLocalFileSync.js')
const readMeshLocalFileSync = require('./readMeshLocalFileSync.js')

/**
 * Read an image or mesh from a file on the local filesystem in Node.js.
 *
 * @param: filePath path to the file on the local filesystem.
 */
const readLocalFileSync = (filePath) => {
  const absoluteFilePath = path.resolve(filePath)
  const extension = getFileExtension(absoluteFilePath)

  const isMesh = extensionToMeshIO.hasOwnProperty(extension)
  if (isMesh) {
    try {
      const mesh = readMeshLocalFileSync(filePath)
      return mesh
    } catch (err) {
      // Was a .vtk image file? Continue to read as an image.
      const image = readImageLocalFileSync(filePath)
      return image
    }
  } else {
    const image = readImageLocalFileSync(filePath)
    return image
  }
}

module.exports = readLocalFileSync
