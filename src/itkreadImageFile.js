const Image = require('./itkImage.js')

const readImageFile = (imageType, file) => {
  return new Image(imageType)
}

module.exports = readImageFile
