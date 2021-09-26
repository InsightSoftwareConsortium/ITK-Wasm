import ImageIOBaseJSBinding from "./ImageIOBaseJSBinding.js"

import IOComponent from './IOComponent.js'
import IOPixel from './IOPixel.js'

interface ImageIOBaseEmscriptenModule {
  ITKImageIO: { new (): ImageIOBaseJSBinding }
  IOComponentType: typeof IOComponent
  IOPixelType: typeof IOPixel
  mountContainingDirectory(dir: string): string
  unmountContainingDirectory(dir: string): void
}

export default ImageIOBaseEmscriptenModule
