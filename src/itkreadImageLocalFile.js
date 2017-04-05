const Image = require('./itkImage.js')

const path = require('path')
const config = require('./itkConfig.js')

const internalReadImage = (imageIO, imageType, filePath) => {
  const image = new Image(imageType)
  imageIO.SetFileName(filePath)
  return image
}

const readImageLocalFile = (imageType, filePath) => {
  return new Promise(function (resolve, reject) {
    try {
      const modulePath = path.join(config.imageIOsURL, 'itkPNGImageIOJSBinding.js')
      const Module = require(modulePath)
      Module.mountContainingDirectory(filePath)
      const imageIO = new Module.ITKPNGImageIO()
      const image = internalReadImage(imageIO, imageType, filePath)
      Module.unmountContainingDirectory(filePath)
      resolve(image)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = readImageLocalFile
