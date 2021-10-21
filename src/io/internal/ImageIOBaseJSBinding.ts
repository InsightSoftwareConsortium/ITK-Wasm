import VectorJSBinding from '../../core/internal/VectorJSBinding.js'
import TypedArray from '../../core/TypedArray.js'
import IOComponent from './IOComponent.js'
import IOPixel from './IOPixel.js'

interface ImageIOBaseJSBinding {
  SetFileName: (fileName: string) => void

  CanReadFile: (fileName: string) => boolean
  ReadImageInformation: () => void
  GetNumberOfDimensions: () => number
  GetNumberOfComponents: () => number
  GetComponentType: () => typeof IOComponent[keyof typeof IOComponent]
  GetPixelType: () => typeof IOPixel[keyof typeof IOPixel]
  GetDirection: (dir1: number) => VectorJSBinding<number>
  GetDimensions: (dim: number) => number
  GetSpacing: (dim: number) => number
  GetOrigin: (dim: number) => number
  Read: () => TypedArray

  CanWriteFile: (fileName: string) => boolean
  WriteImageInformation: () => void
  SetNumberOfDimensions: (dim: number) => void
  SetComponentType: (compType: typeof IOComponent[keyof typeof IOComponent]) => void
  SetPixelType: (pixelType: typeof IOPixel[keyof typeof IOPixel]) => void
  SetNumberOfComponents: (comp: number) => void
  SetDimensions: (dim: number, size: number) => void
  SetSpacing: (dim: number, spacing: number) => void
  SetOrigin: (dim: number, origin: number) => void
  SetDirection: (dim: number, dir: VectorJSBinding<number>) => void
  SetUseCompression: (compression: boolean) => void
  Write: (byteOffset: number) => void
}

export default ImageIOBaseJSBinding
