import IOTypes from '../core/IOTypes.js'
import InterfaceTypes from '../core/InterfaceTypes.js'
import Image from '../core/Image.js'
import Mesh from '../core/Mesh.js'

interface PipelineInput {
  path: string
  type: typeof IOTypes[keyof typeof IOTypes] | typeof InterfaceTypes[keyof typeof InterfaceTypes]
  data: string | Uint8Array | Image | Mesh
}

export default PipelineInput
