import IOComponent from './IOComponent.js'
import IOPixel from './IOPixel.js'

interface ImageIOBaseEmscriptenModule {
  IOComponentType: typeof IOComponent,
  IOPixelType: typeof IOPixel,
}

export default ImageIOBaseEmscriptenModule
