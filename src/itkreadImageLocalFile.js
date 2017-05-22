const path = require('path')

const config = require('./itkConfig.js')

const loadEmscriptenModule = require('./itkloadEmscriptenModule.js')
const readImageEmscriptenFSFile = require('./itkreadImageEmscriptenFSFile.js')

const readImageLocalFile = (filePath) => {
  return new Promise(function (resolve, reject) {
    try {
      const modulePath = path.join(config.imageIOsPath, 'itkPNGImageIOJSBinding.js')
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
