import VectorJSBinding from '../../core/internal/VectorJSBinding.js'
import TypedArray from '../../core/TypedArray.js'
import IOComponent from './IOComponent.js'
import IOPixel from './IOPixel.js'

interface MeshIOBaseJSBinding {
  SetFileName(fileName: string): void
  CanReadFile(fileName: string): boolean
  ReadMeshInformation(): void

  GetPointDimension(): number
  GetPointComponentType(): typeof IOComponent[keyof typeof IOComponent]
  GetNumberOfPoints(): number
  ReadPoints(): TypedArray

  GetPointPixelType(): typeof IOPixel[keyof typeof IOPixel]
  GetPointPixelComponentType(): typeof IOComponent[keyof typeof IOComponent]
  GetNumberOfPointPixelComponents(): number
  GetNumberOfPointPixels(): number
  ReadPointData(): TypedArray

  GetCellPixelType(): typeof IOPixel[keyof typeof IOPixel]
  GetCellPixelComponentType(): typeof IOComponent[keyof typeof IOComponent]
  GetNumberOfCellPixelComponents(): number
  GetNumberOfCellPixels(): number
  ReadCellData(): TypedArray

  GetNumberOfCells(): number
  GetCellComponentType(): typeof IOComponent[keyof typeof IOComponent]
  ReadCells(): TypedArray
  GetCellBufferSize(): number
}

export default MeshIOBaseJSBinding
