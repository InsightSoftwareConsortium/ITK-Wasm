const path = require('path')
const mime = require('mime-types')

const mimeToIO = require('./MimeToMeshIO.js')
const getFileExtension = require('./getFileExtension.js')
const extensionToIO = require('./extensionToMeshIO.js')
const MeshIOIndex = require('./MeshIOIndex.js')

const loadEmscriptenModule = require('./loadEmscriptenModuleNode.js')
const readMeshEmscriptenFSFile = require('./readMeshEmscriptenFSFile.js')

const readMeshLocalFileSync = (filePath) => {
  const meshIOsPath = path.resolve(__dirname, 'MeshIOs')
  const absoluteFilePath = path.resolve(filePath)
  const mimeType = mime.lookup(absoluteFilePath)
  const extension = getFileExtension(absoluteFilePath)

  let io = null
  if (mimeToIO.hasOwnProperty(mimeType)) {
    io = mimeToIO[mimeType]
  } else if (extensionToIO.hasOwnProperty(extension)) {
    io = extensionToIO[extension]
  } else {
    for (let idx = 0; idx < MeshIOIndex.length; ++idx) {
      const modulePath = path.join(meshIOsPath, MeshIOIndex[idx])
      const Module = loadEmscriptenModule(modulePath)
      const meshIO = new Module.ITKMeshIO()
      Module.mountContainingDirectory(absoluteFilePath)
      meshIO.SetFileName(absoluteFilePath)
      if (meshIO.CanReadFile(absoluteFilePath)) {
        io = MeshIOIndex[idx]
        Module.unmountContainingDirectory(absoluteFilePath)
        break
      }
      Module.unmountContainingDirectory(absoluteFilePath)
    }
  }
  if (io === null) {
    throw Error('Could not find IO for: ' + absoluteFilePath)
  }

  const modulePath = path.join(meshIOsPath, io)
  const Module = loadEmscriptenModule(modulePath)
  Module.mountContainingDirectory(absoluteFilePath)
  const mesh = readMeshEmscriptenFSFile(Module, absoluteFilePath)
  Module.unmountContainingDirectory(absoluteFilePath)
  return mesh
}

module.exports = readMeshLocalFileSync
