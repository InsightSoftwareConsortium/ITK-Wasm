import IOTypes from '../core/IOTypes.js'
import InterfaceTypes from '../core/InterfaceTypes.js'
import TextFile from '../core/interface-types/text-file.js'
import BinaryFile from '../core/interface-types/binary-file.js'
import TextStream from '../core/interface-types/text-stream.js'
import BinaryStream from '../core/interface-types/binary-stream.js'
import Image from '../core/interface-types/image.js'
import Mesh from '../core/interface-types/mesh.js'
import PolyData from '../core/interface-types/poly-data.js'
import JsonCompatible from '../core/interface-types/json-compatible.js'

interface PipelineInput {
  // Backwards compatibility with IOTypes -- remove?
  path?: string
  type:
  | (typeof IOTypes)[keyof typeof IOTypes]
  | (typeof InterfaceTypes)[keyof typeof InterfaceTypes]
  data:
  | string
  | Uint8Array
  | JsonCompatible
  | TextStream
  | BinaryStream
  | TextFile
  | BinaryFile
  | Image
  | Mesh
  | PolyData
}

export default PipelineInput
