import MeshIOBaseJSBinding from "./MeshIOBaseJSBinding.js"

import IOComponent from './IOComponent.js'
import IOPixel from './IOPixel.js'

import FileType from './FileType.js'
import ByteOrder from './ByteOrder.js'

interface MeshIOBaseEmscriptenModule {
  ITKMeshIO: { new (): MeshIOBaseJSBinding }
  IOComponentType: typeof IOComponent,
  IOPixelType: typeof IOPixel,
  mountContainingDirectory(dir: string): string
  unmountContainingDirectory(dir: string): void

  _malloc(numberOfBytes: number): number
  _free(numberOfBytes: number): void

  HEAPU8: { buffer: ArrayBuffer }

  FileType: typeof FileType
  ByteOrder: typeof ByteOrder
}

export default MeshIOBaseEmscriptenModule
