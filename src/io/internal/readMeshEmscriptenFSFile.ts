import Mesh from '../../core/Mesh.js'
import MeshType from '../../core/MeshType.js'

import meshIOComponentToJSComponent from './meshIOComponentToJSComponent.js'
import meshIOPixelTypeToJSPixelType from './meshIOPixelTypeToJSPixelType.js'

import MeshIOBaseEmscriptenModule from './MeshIOBaseEmscriptenModule.js'

function readMeshEmscriptenFSFile(emscriptenModule: MeshIOBaseEmscriptenModule, filePath: string): Mesh {
  const meshIO = new emscriptenModule.ITKMeshIO()
  meshIO.SetFileName(filePath)
  if (!meshIO.CanReadFile(filePath)) {
    throw new Error('Could not read file: ' + filePath)
  }
  meshIO.ReadMeshInformation()

  const ioDimensions = meshIO.GetPointDimension()

  const ioPointComponentType = meshIO.GetPointComponentType()
  const pointComponentType = meshIOComponentToJSComponent(emscriptenModule, ioPointComponentType)
  if (pointComponentType === null) {
    throw Error('point component type cannot be unknown / null')
  }

  const ioCellComponentType = meshIO.GetCellComponentType()
  const cellComponentType = meshIOComponentToJSComponent(emscriptenModule, ioCellComponentType)
  if (cellComponentType === null) {
    throw Error('cell component type cannot be unknown / null')
  }

  const ioPointPixelComponentType = meshIO.GetPointPixelComponentType()
  const pointPixelComponentType = meshIOComponentToJSComponent(emscriptenModule, ioPointPixelComponentType)
  if (pointPixelComponentType === null) {
    throw Error('point pixel component type cannot be unknown / null')
  }
  const ioPointPixelType = meshIO.GetPointPixelType()
  const pointPixelType = meshIOPixelTypeToJSPixelType(emscriptenModule, ioPointPixelType)
  if (pointPixelType === null) {
    throw Error('point pixel type cannot be unknown / null')
  }
  const pointPixelComponents = meshIO.GetNumberOfPointPixelComponents()

  const ioCellPixelComponentType = meshIO.GetCellPixelComponentType()
  const cellPixelComponentType = meshIOComponentToJSComponent(emscriptenModule, ioCellPixelComponentType)
  if (cellPixelComponentType === null) {
    throw Error('point pixel type cannot be unknown / null')
  }
  const ioCellPixelType = meshIO.GetCellPixelType()
  const cellPixelType = meshIOPixelTypeToJSPixelType(emscriptenModule, ioCellPixelType)
  if (cellPixelType === null) {
    throw Error('cell pixel type cannot be unknown / null')
  }
  const cellPixelComponents = meshIO.GetNumberOfCellPixelComponents()

  const meshType = new MeshType(ioDimensions,
    pointComponentType,
    pointPixelComponentType,
    pointPixelType,
    pointPixelComponents,
    cellComponentType,
    cellPixelComponentType,
    cellPixelType,
    cellPixelComponents)
  const mesh = new Mesh(meshType)

  mesh.numberOfPoints = meshIO.GetNumberOfPoints()
  if (mesh.numberOfPoints > 0) {
    mesh.points = meshIO.ReadPoints()
  }

  mesh.numberOfCells = meshIO.GetNumberOfCells()
  if (mesh.numberOfCells > 0) {
    mesh.cellBufferSize = meshIO.GetCellBufferSize()
    mesh.cells = meshIO.ReadCells()
  }

  mesh.numberOfPointPixels = meshIO.GetNumberOfPointPixels()
  if (mesh.numberOfPointPixels > 0) {
    mesh.pointData = meshIO.ReadPointData()
  }

  mesh.numberOfCellPixels = meshIO.GetNumberOfCellPixels()
  if (mesh.numberOfCellPixels > 0) {
    mesh.cellData = meshIO.ReadCellData()
  }

  return mesh
}

export default readMeshEmscriptenFSFile
