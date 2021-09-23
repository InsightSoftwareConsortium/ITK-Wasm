import IOComponent from './IOComponent.js'
import IOPixel from './IOPixel.js'

interface MeshIOBaseJSBinding {
  IOComponentType: typeof IOComponent,
  IOPixelType: typeof IOPixel,
}

export default MeshIOBaseJSBinding
