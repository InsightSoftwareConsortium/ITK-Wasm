import meshJSComponentToIOComponent from './meshJSComponentToIOComponent.js'
import meshJSPixelTypeToIOPixelType from './meshJSPixelTypeToIOPixelType.js'

import WriteMeshOptions from '../WriteMeshOptions.js'

import MeshIOBaseEmscriptenModule from './MeshIOBaseEmscriptenModule.js'

import Mesh from '../../core/Mesh.js'

function writeMeshEmscriptenFSFile(emscriptenModule: MeshIOBaseEmscriptenModule, options: WriteMeshOptions, mesh: Mesh, filePath: string): void {
  const meshIO = new emscriptenModule.ITKMeshIO()
  meshIO.SetFileName(filePath)
  if (!meshIO.CanWriteFile(filePath)) {
    throw new Error('Could not write file: ' + filePath)
  }

  const dimension = mesh.meshType.dimension
  meshIO.SetPointDimension(dimension)

  const pointIOComponentType = meshJSComponentToIOComponent(emscriptenModule, mesh.meshType.pointComponentType)
  if (pointIOComponentType === null) {
    throw Error('point io component type cannot be unknown / null')
  }
  meshIO.SetPointComponentType(pointIOComponentType)

  const cellIOComponentType = meshJSComponentToIOComponent(emscriptenModule, mesh.meshType.cellComponentType)
  if (cellIOComponentType === null) {
    throw Error('cell io component type cannot be unknown / null')
  }
  meshIO.SetCellComponentType(cellIOComponentType)

  const pointPixelIOComponentType = meshJSComponentToIOComponent(emscriptenModule, mesh.meshType.pointPixelComponentType)
  if (pointPixelIOComponentType === null) {
    throw Error('point pixel io component type cannot be unknown / null')
  }
  meshIO.SetPointPixelComponentType(pointPixelIOComponentType)
  const pointIOPixelType = meshJSPixelTypeToIOPixelType(emscriptenModule, mesh.meshType.pointPixelType)
  meshIO.SetPointPixelType(pointIOPixelType)
  meshIO.SetNumberOfPointPixelComponents(mesh.meshType.pointPixelComponents)

  const cellPixelIOComponentType = meshJSComponentToIOComponent(emscriptenModule, mesh.meshType.cellPixelComponentType)
  if (cellPixelIOComponentType === null) {
    throw Error('cell pixel io component type cannot be unknown / null')
  }
  meshIO.SetCellPixelComponentType(cellPixelIOComponentType)
  const cellIOPixelType = meshJSPixelTypeToIOPixelType(emscriptenModule, mesh.meshType.cellPixelType)
  meshIO.SetCellPixelType(cellIOPixelType)
  meshIO.SetNumberOfCellPixelComponents(mesh.meshType.cellPixelComponents)

  let useCompression = false
  if(typeof options.useCompression !== 'undefined') {
    useCompression = options.useCompression
  }
  let binaryFileType = false
  if(typeof options.binaryFileType !== 'undefined') {
    binaryFileType = options.binaryFileType
  }
  meshIO.SetUseCompression(useCompression)

  if (binaryFileType) {
    meshIO.SetFileType(emscriptenModule.FileType.BINARY)
  } else {
    meshIO.SetFileType(emscriptenModule.FileType.ASCII)
  }

  meshIO.SetByteOrder(emscriptenModule.ByteOrder.LittleEndian)

  meshIO.SetNumberOfPoints(mesh.numberOfPoints)
  if (mesh.numberOfPoints > 0) {
    meshIO.SetUpdatePoints(true)
  }
  meshIO.SetNumberOfPointPixels(mesh.numberOfPointPixels)
  if (mesh.numberOfPointPixels > 0) {
    meshIO.SetUpdatePointData(true)
  }

  meshIO.SetNumberOfCells(mesh.numberOfCells)
  if (mesh.numberOfCells > 0) {
    meshIO.SetUpdateCells(true)
  }
  meshIO.SetNumberOfCellPixels(mesh.numberOfCellPixels)
  meshIO.SetCellBufferSize(mesh.cellBufferSize)
  if (mesh.numberOfCellPixels > 0) {
    meshIO.SetUpdatePointData(true)
  }

  meshIO.WriteMeshInformation()

  if (mesh.numberOfPoints > 0) {
    // @ts-ignore: error TS2531: Object is possibly 'null'.
    const numberOfBytes = mesh.points.length * mesh.points.BYTES_PER_ELEMENT
    const dataPtr = emscriptenModule._malloc(numberOfBytes)
    const dataHeap = new Uint8Array(emscriptenModule.HEAPU8.buffer, dataPtr, numberOfBytes)
    // @ts-ignore: error TS2531: Object is possibly 'null'.
    dataHeap.set(new Uint8Array(mesh.points.buffer))
    meshIO.WritePoints(dataHeap.byteOffset)
    emscriptenModule._free(dataHeap.byteOffset)
  }

  if (mesh.numberOfCells > 0) {
    // @ts-ignore: error TS2531: Object is possibly 'null'.
    const numberOfBytes = mesh.cells.length * mesh.cells.BYTES_PER_ELEMENT
    const dataPtr = emscriptenModule._malloc(numberOfBytes)
    const dataHeap = new Uint8Array(emscriptenModule.HEAPU8.buffer, dataPtr, numberOfBytes)
    // @ts-ignore: error TS2531: Object is possibly 'null'.
    dataHeap.set(new Uint8Array(mesh.cells.buffer))
    meshIO.WriteCells(dataHeap.byteOffset)
    emscriptenModule._free(dataHeap.byteOffset)
  }

  if (mesh.numberOfPointPixels > 0) {
    // @ts-ignore: error TS2531: Object is possibly 'null'.
    const numberOfBytes = mesh.pointData.length * mesh.pointData.BYTES_PER_ELEMENT
    const dataPtr = emscriptenModule._malloc(numberOfBytes)
    const dataHeap = new Uint8Array(emscriptenModule.HEAPU8.buffer, dataPtr, numberOfBytes)
    // @ts-ignore: error TS2531: Object is possibly 'null'.
    dataHeap.set(new Uint8Array(mesh.pointData.buffer))
    meshIO.WritePointData(dataHeap.byteOffset)
    emscriptenModule._free(dataHeap.byteOffset)
  }

  if (mesh.numberOfCellPixels > 0) {
    // @ts-ignore: error TS2531: Object is possibly 'null'.
    const numberOfBytes = mesh.cellData.length * mesh.cellData.BYTES_PER_ELEMENT
    const dataPtr = emscriptenModule._malloc(numberOfBytes)
    const dataHeap = new Uint8Array(emscriptenModule.HEAPU8.buffer, dataPtr, numberOfBytes)
    // @ts-ignore: error TS2531: Object is possibly 'null'.
    dataHeap.set(new Uint8Array(mesh.cellData.buffer))
    meshIO.WriteCellData(dataHeap.byteOffset)
    emscriptenModule._free(dataHeap.byteOffset)
  }

  meshIO.Write()
}

export default writeMeshEmscriptenFSFile
