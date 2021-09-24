import IOComponent from './IOComponent.js'
import IOPixel from './IOPixel.js'

interface MeshIOBaseEmscriptenModule {
  IOComponentType: typeof IOComponent,
  IOPixelType: typeof IOPixel,
}

export default MeshIOBaseEmscriptenModule
