const IntTypes = require('./IntTypes.js')
const FloatTypes = require('./FloatTypes.js')
const PixelTypes = require('./PixelTypes.js')

const MeshType = function (dimension = 2,
    pointComponentType = FloatTypes.Float32,
    cellComponentType = IntTypes.Int32,
    pointPixelType = PixelTypes.Scalar,
    pointPixelComponents = 1,
    cellPixelType = PixelTypes.Scalar,
    cellPixelComponents = 1) {
  this.dimension = dimension
  this.pointComponentType = pointComponentType
  this.cellComponentType = cellComponentType
  this.pointPixelType = pointPixelType
  this.pointPixelComponents = pointPixelComponents
  this.cellPixelType = cellPixelType
  this.cellPixelComponents = cellPixelComponents
}

module.exports = MeshType
