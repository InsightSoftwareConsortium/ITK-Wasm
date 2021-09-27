import IOTypes from './IOTypes.js'
import Image from './Image.js'
import Mesh from './Mesh.js'

interface PipelineInput {
  path: string
  type: typeof IOTypes[keyof typeof IOTypes]
  data: string | Uint8Array | Image | Mesh
}

export default PipelineInput
