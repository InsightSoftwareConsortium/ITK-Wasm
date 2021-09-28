import VectorJSBinding from '../../core/internal/VectorJSBinding.js'
import ImageIOBaseJSBinding from "./ImageIOBaseJSBinding.js"

import IOComponent from './IOComponent.js'
import IOPixel from './IOPixel.js'

interface ImageIOBaseEmscriptenModule {
  ITKImageIO: { new (): ImageIOBaseJSBinding }
  IOComponentType: typeof IOComponent
  IOPixelType: typeof IOPixel
  mountContainingDirectory(dir: string): string
  unmountContainingDirectory(dir: string): void

  AxisDirectionType: { new(): VectorJSBinding<number> }

  _malloc(numberOfBytes: number): number
  _free(numberOfBytes: number): void

  HEAPU8: { buffer: ArrayBuffer }
}

export default ImageIOBaseEmscriptenModule
