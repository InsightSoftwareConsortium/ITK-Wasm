const IntTypes = require('./IntTypes.js')
const FloatTypes = require('./FloatTypes.js')
const PixelTypes = require('./PixelTypes.js')
const meshJSComponentToIOComponent = require('./meshJSComponentToIOComponent.js')
const meshJSPixelTypeToIOPixelType = require('./meshJSPixelTypeToIOPixelType.js')

const writeMeshEmscriptenFSFile = (module, useCompression, mesh, filePath) => {
  const meshIO = new module.ITKMeshIO()
  meshIO.SetFileName(filePath)
  if (!meshIO.CanWriteFile(filePath)) {
    throw new Error('Could not write file: ' + filePath)
  }

  const dimension = mesh.meshType.dimension
  meshIO.SetPointDimensions(dimension)

  const pointIOComponentType = meshJSComponentToIOComponent(module, mesh.meshType.pointComponentType)
  meshIO.SetPointComponentType(pointIOComponentType)

  const cellIOComponentType = meshJSComponentToIOComponent(module, mesh.meshType.cellComponentType)
  meshIO.SetCellComponentType(cellIOComponentType)

  const pointIOPixelType = meshIOPixelTypeToJSPixelType(module, mesh.meshType.pointPixelType)
  meshIO.SetPointPixelType(pointIOPixelType)
  meshIO.SetPointPixelComponents(mesh.meshType.pointPixelComponents)

  const cellIOPixelType = meshIOPixelTypeToJSPixelType(module, mesh.meshType.cellPixelType)
  meshIO.SetCellPixelType(cellIOPixelType)
  meshIO.SetCellPixelComponents(mesh.meshType.cellPixelComponents)

  meshIO.SetUseCompression(useCompression)

  meshIO.SetNumberOfPoints(mesh.numberOfPoints)
  if (mesh.numberOfPoints > 0) {
    let numberOfBytes = mesh.points.length * mesh.points.BYTES_PER_ELEMENT
    let dataPtr = module._malloc(numberOfBytes)
    let dataHeap = new Uint8Array(module.HEAPU8.buffer, dataPtr, numberOfBytes)
    dataHeap.set(new Uint8Array(mesh.points.buffer))
    meshIO.WritePoints(dataHeap.byteOffset)
    module._free(dataHeap.byteOffset)
  }

  meshIO.SetNumberOfPointPixels(mesh.numberOfPointPixels)
  if (mesh.numberOfPointPixels > 0) {
    let numberOfBytes = mesh.pointData.length * mesh.pointData.BYTES_PER_ELEMENT
    let dataPtr = module._malloc(numberOfBytes)
    let dataHeap = new Uint8Array(module.HEAPU8.buffer, dataPtr, numberOfBytes)
    dataHeap.set(new Uint8Array(mesh.pointData.buffer))
    meshIO.WritePoints(dataHeap.byteOffset)
    module._free(dataHeap.byteOffset)
  }

  meshIO.SetNumberOfCells(mesh.numberOfCells)
  if (mesh.numberOfCells > 0) {
    let numberOfBytes = mesh.cells.length * mesh.cells.BYTES_PER_ELEMENT
    let dataPtr = module._malloc(numberOfBytes)
    let dataHeap = new Uint8Array(module.HEAPU8.buffer, dataPtr, numberOfBytes)
    dataHeap.set(new Uint8Array(mesh.cells.buffer))
    meshIO.WriteCells(dataHeap.byteOffset)
    module._free(dataHeap.byteOffset)
  }

  meshIO.SetNumberOfCellPixels(mesh.numberOfCellPixels)
  meshIO.SetCellBufferSize(mesh.cellBufferSize)
  if (mesh.numberOfCellPixels > 0) {
    let numberOfBytes = mesh.cellData.length * mesh.cellData.BYTES_PER_ELEMENT
    let dataPtr = module._malloc(numberOfBytes)
    let dataHeap = new Uint8Array(module.HEAPU8.buffer, dataPtr, numberOfBytes)
    dataHeap.set(new Uint8Array(mesh.cellData.buffer))
    meshIO.WriteCells(dataHeap.byteOffset)
    module._free(dataHeap.byteOffset)
  }
}

module.exports = writeMeshEmscriptenFSFile
