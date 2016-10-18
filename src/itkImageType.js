const IntTypes = require('./itkIntTypes.js')

const ImageType = function (pixelType = IntTypes.UInt8, dimension = 2) {
  this.pixelType = pixelType
  this.dimension = dimension
}

module.exports = ImageType
