const path = require('path')
const mime = require('mime-types')

const config = require('./itkConfig.js')

const mimeToIO = require('./itkMimeToIO.js')
const getFileExtension = require('./itkgetFileExtension.js')
const extensionToIO = require('./itkExtensionToIO.js')

const loadEmscriptenModule = require('./itkloadEmscriptenModule.js')
const readImageEmscriptenFSFile = require('./itkreadImageEmscriptenFSFile.js')

const readImageLocalFile = (filePath) => {
  return new Promise(function (resolve, reject) {
    try {
      const mimeType = mime.lookup(filePath)
      const extension = getFileExtension(filePath)

      let io = null
      if (mimeToIO.hasOwnProperty(mimeType)) {
        io = mimeToIO[mimeType]
      } else if (extensionToIO.hasOwnProperty(extension)) {
        io = extensionToIO[extension]
      } else {
        // todo: Iterate through available IO's and have them run
        // .CanReadFile(filePath)
      }

      if (io === null) {
        reject(Error('Could not find IO for: ' + filePath))
      }
      const modulePath = path.join(config.imageIOsPath, io)
      const Module = loadEmscriptenModule(modulePath)
      Module.mountContainingDirectory(filePath)
      const image = readImageEmscriptenFSFile(Module, filePath)
      Module.unmountContainingDirectory(filePath)
      resolve(image)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = readImageLocalFile
