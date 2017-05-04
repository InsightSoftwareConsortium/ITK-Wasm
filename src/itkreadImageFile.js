// const path = require('path')

// const config = require('./itkConfig.js')

// const loadEmscriptenModule = require('./itkloadEmscriptenModule.js')

const readImageFile = (file) => {
  return new Promise(function (resolve, reject) {
    try {
      // const modulePath = path.join(config.imageIOsURL, 'itkPNGImageIOJSBinding.js')
      // const Module = loadEmscriptenModule(modulePath)
      // const image = readImageEmscriptenFSFile(Module, filePath)
      // resolve(image)
      resolve(null)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = readImageFile
