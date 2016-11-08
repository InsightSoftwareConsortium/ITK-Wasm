const Image = require('./itkImage.js')

const readImage = (imageType, fileSystem, filePath) => {
  const image = new Image(imageType)
  return image
}

module.exports = readImage
