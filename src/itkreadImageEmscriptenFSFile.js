const Image = require('./itkImage.js')

const readImageEmscriptenFSFile = (imageType, file) => {
  return new Image(imageType)
}

module.exports = readImageEmscriptenFSFile
