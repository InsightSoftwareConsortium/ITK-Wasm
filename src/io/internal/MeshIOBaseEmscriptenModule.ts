import MeshIOBaseJSBinding from "./MeshIOBaseJSBinding.js"

import IOComponent from './IOComponent.js'
import IOPixel from './IOPixel.js'

interface MeshIOBaseEmscriptenModule {
  ITKMeshIO: { new (): MeshIOBaseJSBinding }
  IOComponentType: typeof IOComponent,
  IOPixelType: typeof IOPixel,
  mountContainingDirectory(dir: string): string
  unmountContainingDirectory(dir: string): void
}

export default MeshIOBaseEmscriptenModule
