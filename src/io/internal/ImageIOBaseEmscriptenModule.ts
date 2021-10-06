import EmscriptenModule from '../../core/EmscriptenModule.js'

import VectorJSBinding from '../../core/internal/VectorJSBinding.js'
import ImageIOBaseJSBinding from "./ImageIOBaseJSBinding.js"

import IOComponent from './IOComponent.js'
import IOPixel from './IOPixel.js'

interface ImageIOBaseEmscriptenModule extends EmscriptenModule {
  ITKImageIO: { new (): ImageIOBaseJSBinding }
  IOComponentType: typeof IOComponent
  IOPixelType: typeof IOPixel
  mountContainingDir(dir: string): string
  unmountContainingDir(dir: string): void

  AxisDirectionType: { new(): VectorJSBinding<number> }
}

export default ImageIOBaseEmscriptenModule
