import EmscriptenModule from '../../core/EmscriptenModule.js'

import MeshIOBaseJSBinding from './MeshIOBaseJSBinding.js'

import IOComponent from './IOComponent.js'
import IOPixel from './IOPixel.js'

import FileType from './FileType.js'
import ByteOrder from './ByteOrder.js'

interface MeshIOBaseEmscriptenModule extends EmscriptenModule {
  ITKMeshIO: new () => MeshIOBaseJSBinding
  IOComponentType: typeof IOComponent
  IOPixelType: typeof IOPixel
  mountContainingDir: (dir: string) => string
  unmountContainingDir: (dir: string) => void

  FileType: typeof FileType
  ByteOrder: typeof ByteOrder
}

export default MeshIOBaseEmscriptenModule
