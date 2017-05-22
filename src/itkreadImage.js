const Image = require('./itkImage.js')

const path = require('path')
const requirejs = require('requirejs')
const config = require('./itkConfig.js')
requirejs.config({
  baseURL: config.imageIOsPath
})

const internalReadImage = (imageIO, imageType, filePath) => {
  const image = new Image(imageType)
  imageIO.SetFileName(filePath)
  return image
}

const readImage = (imageType, filePath) => {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof (module) === 'object' && module.exports) {
        const modulePath = path.join(config.imageIOsPath, 'itkPNGImageIOJSBinding.js')
        const Module = require(modulePath)
        const imageIO = new Module.ITKPNGImageIO()
        const image = internalReadImage(imageIO, imageType, filePath)
        resolve(image)
      } else {
        requirejs([path.join(config.imageIOsPath, 'itkPNGImageIOJSBinding.js')], function (Module) {
          const imageIO = new Module.ITKPNGImageIO()
          const image = internalReadImage(imageIO, imageType, filePath)
          resolve(image)
        })
      }
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = readImage
