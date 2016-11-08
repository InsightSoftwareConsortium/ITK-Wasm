const Image = require('./itkImage.js')

const SystemRegisterLoader = require('system-register-loader')

const readImage = (imageType, fileSystem, filePath) => {
  return new Promise(function (resolve, reject) {
    const loader = new SystemRegisterLoader(__filename)
    const fs = require('fs')
    console.log(fs.readdirSync('./dist/ImageIOs/'))
    return loader.import('./dist/ImageIOs/itkPNGImageIOJSBinding.js').then(function (imageIO) {
      const image = new Image(imageType)
      console.log(imageIO)
      return image
    })
      .catch(function (err) {
        console.log(err)
        throw new Error('Could not load the ImageIO')
      })
  })
}

module.exports = readImage
