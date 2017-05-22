const IntTypes = require('./itkIntTypes.js')
const PixelTypes = require('./itkPixelTypes.js')

const ImageType = function (dimension = 2,
    componentType = IntTypes.UInt8,
    pixelType = PixelTypes.Scalar,
    components = 1) {
  this.dimension = dimension
  this.componentType = componentType
  this.pixelType = pixelType
  this.components = components
}

module.exports = ImageType
