const Image = require('./itkImage.js')

const path = require('path')
const requirejs = require('requirejs')
const config = require('./itkConfig.js')
requirejs.config({
  baseURL: config.imageIOsURL
// baseURL: '../ImageIOs',
})

const readImage = (imageType, fileSystem, filePath) => {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof (module) === 'object' && module.exports) {
        const modulePath = path.join(config.imageIOsURL, 'itkPNGImageIOJSBinding.js')
        const Module = require(modulePath)
        const imageio = new Module.ITKPNGImageIO()
        imageio.SetFileName(filePath)
        const image = new Image(imageType)
        resolve(image)
      } else {
        requirejs(['ImageIOs/itkPNGImageIOJSBinding'], function (Module) {
          const image = new Image(imageType)
          resolve(image)
        })
      }
    } catch (err) {
      console.log(err)
      reject(err)
    }
  // let baseDir = './'
  // if (__dirname) {
  // baseDir = path.join(__dirname, '/')
  // }
  // return SystemJS.import(baseDir + 'ImageIOs/itkPNGImageIOJSBinding.js').then(function (imageIO) {
  // const image = new Image(imageType)
  // console.log(imageIO)
  // resolve(image)
  // })
  // .catch(function (err) {
  // console.log(err)
  // reject(err)
  // })
  })
}

module.exports = readImage
