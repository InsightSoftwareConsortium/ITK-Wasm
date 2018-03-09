const Mesh = require('./Mesh.js')
const MeshType = require('./MeshType.js')

const meshIOComponentToJSComponent = require('./meshIOComponentToJSComponent.js')
const meshIOPixelTypeToJSPixelType = require('./meshIOPixelTypeToJSPixelType.js')

const readMeshEmscriptenFSFile = (module, filePath) => {
  const meshIO = new module.ITKMeshIO()
  meshIO.SetFileName(filePath)
  if (!meshIO.CanReadFile(filePath)) {
    throw new Error('Could not read file: ' + filePath)
  }
  meshIO.ReadMeshInformation()

  const ioDimensions = meshIO.GetPointDimension()
  let meshType = new MeshType(ioDimensions)

  const pointComponentType = meshIO.GetPointComponentType()
  meshType.pointComponentType = meshIOComponentToJSComponent(module, pointComponentType)

  const cellComponentType = meshIO.GetCellComponentType()
  meshType.cellComponentType = meshIOComponentToJSComponent(module, cellComponentType)

  const pointPixelType = meshIO.GetPointPixelType()
  meshType.pixelType = meshIOPixelTypeToJSPixelType(module, pointPixelType)
  meshType.pointPixelComponents = meshIO.GetPointPixelComponents()

  const cellPixelType = meshIO.GetCellPixelType()
  meshType.pixelType = meshIOPixelTypeToJSPixelType(module, cellPixelType)
  meshType.cellPixelComponents = meshIO.GetCellPixelComponents()

  let mesh = new Mesh(meshType)

  mesh.numberOfPoints = meshIO.GetNumberOfPoints()
  mesh.points = meshIO.ReadPoints()

  mesh.numberOfCells = meshIO.GetNumberOfCells()
  mesh.cells = meshIO.ReadCells()

  mesh.numberofPointPixels = meshIO.GetNumberOfPointPixels()
  mesh.pointData = meshIO.ReadPointData()

  mesh.numberofCellPixels = meshIO.GetNumberOfCellPixels()
  mesh.cellData = meshIO.ReadCellData()
  mesh.cellBufferSize = meshIO.GetCellBufferSize()

  return mesh
}

module.exports = readMeshEmscriptenFSFile
