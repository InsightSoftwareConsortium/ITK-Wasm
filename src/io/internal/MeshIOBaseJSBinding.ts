import VectorJSBinding from '../../core/internal/VectorJSBinding.js'
import TypedArray from '../../core/TypedArray.js'
import IOComponent from './IOComponent.js'
import IOPixel from './IOPixel.js'
import FileType from './FileType.js'
import ByteOrder from './ByteOrder.js'

interface MeshIOBaseJSBinding {
  SetFileName: (fileName: string) => void

  CanReadFile: (fileName: string) => boolean
  ReadMeshInformation: () => void

  GetPointDimension: () => number
  GetPointComponentType: () => typeof IOComponent[keyof typeof IOComponent]
  GetNumberOfPoints: () => number
  ReadPoints: () => TypedArray

  GetPointPixelType: () => typeof IOPixel[keyof typeof IOPixel]
  GetPointPixelComponentType: () => typeof IOComponent[keyof typeof IOComponent]
  GetNumberOfPointPixelComponents: () => number
  GetNumberOfPointPixels: () => number
  ReadPointData: () => TypedArray

  GetCellPixelType: () => typeof IOPixel[keyof typeof IOPixel]
  GetCellPixelComponentType: () => typeof IOComponent[keyof typeof IOComponent]
  GetNumberOfCellPixelComponents: () => number
  GetNumberOfCellPixels: () => number
  ReadCellData: () => TypedArray

  GetNumberOfCells: () => number
  GetCellComponentType: () => typeof IOComponent[keyof typeof IOComponent]
  ReadCells: () => TypedArray
  GetCellBufferSize: () => number

  CanWriteFile: (fileName: string) => boolean
  WriteMeshInformation: () => void

  SetUseCompression: (compression: boolean) => void
  SetFileType: (fileType: typeof FileType[keyof typeof FileType]) => void
  SetByteOrder: (fileType: typeof ByteOrder[keyof typeof ByteOrder]) => void

  SetPointDimension: (dim: number) => void
  SetUpdatePoints: (update: boolean) => void
  SetPointComponentType: (compType: typeof IOComponent[keyof typeof IOComponent]) => void
  SetNumberOfPoints: (points: number) => void
  WritePoints: (byteOffset: number) => void

  SetPointPixelType: (pointPixelType: typeof IOPixel[keyof typeof IOPixel]) => void
  SetPointPixelComponentType: (compType: typeof IOComponent[keyof typeof IOComponent]) => void
  SetUpdatePointData: (update: boolean) => void
  SetNumberOfPointPixelComponents: (comp: number) => void
  SetNumberOfPointPixels: (pointPixels: number) => void
  WritePointData: (byteOffset: number) => void

  SetCellPixelType: (pixelType: typeof IOPixel[keyof typeof IOPixel]) => void
  SetCellPixelComponentType: (compType: typeof IOComponent[keyof typeof IOComponent]) => void
  SetNumberOfCellPixelComponents: (comp: number) => void
  SetNumberOfCellPixels: (cellPixels: number) => void
  WriteCells: (byteOffset: number) => void

  SetNumberOfCells: (cells: number) => void
  SetUpdateCells: (update: boolean) => void
  SetCellComponentType: (compType: typeof IOComponent[keyof typeof IOComponent]) => void
  SetCellBufferSize: (bufferSize: number) => void
  WriteCellData: (byteOffset: number) => void
  Write: () => void
}

export default MeshIOBaseJSBinding
