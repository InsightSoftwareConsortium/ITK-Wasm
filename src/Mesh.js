const MeshType = require('./MeshType.js')
const bufferToTypedArray = require('./bufferToTypedArray.js')

const Mesh = function (meshType = new MeshType()) {
  this.meshType = meshType

  this.name = 'Mesh'

  this.numberOfPoints = 0
  this.points = bufferToTypedArray(meshType.pointComponentType, new ArrayBuffer(0))

  this.numberOfPointPixels = 0
  this.pointData = bufferToTypedArray(meshType.pointPixelComponentType, new ArrayBuffer(0))

  this.numberOfCells = 0
  this.cells = bufferToTypedArray(meshType.cellComponentType, new ArrayBuffer(0))

  this.numberOfCellPixels = 0
  this.cellData = bufferToTypedArray(meshType.cellPixelComponentType, new ArrayBuffer(0))
  this.cellBufferSize = 0
}

module.exports = Mesh
