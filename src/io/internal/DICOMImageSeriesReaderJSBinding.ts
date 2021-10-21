import VectorJSBinding from '../../core/internal/VectorJSBinding.js'
import TypedArray from '../../core/TypedArray.js'
import IOComponent from './IOComponent.js'
import IOPixel from './IOPixel.js'

interface DICOMImageSeriesReaderJSBinding {
  CanReadTestFile: (fileName: string) => boolean
  SetTestFileName: (fileName: string) => void
  SetFileNames: (fileNames: VectorJSBinding<string>) => void
  ReadTestImageInformation: () => void
  GetNumberOfComponents: () => number
  GetIOComponentType: () => typeof IOComponent[keyof typeof IOComponent]
  GetIOPixelType: () => typeof IOPixel[keyof typeof IOPixel]
  SetIOComponentType: (ioComponentType: typeof IOComponent[keyof typeof IOComponent]) => void
  SetIOPixelType: (ioPixelType: typeof IOPixel[keyof typeof IOPixel]) => void
  SetDirectory: (directory: string) => void
  GetDirection: (dir1: number, dir2: number) => number
  GetDimensions: (dim: number) => number
  GetSpacing: (dim: number) => number
  GetOrigin: (dim: number) => number
  GetSize: (dim: number) => number
  GetPixelBufferData: () => TypedArray
  Read: () => boolean
  DeleteImage: () => void
}

export default DICOMImageSeriesReaderJSBinding
