import InterfaceTypes from '../interface-types/interface-types.js'
import TextFile from '../interface-types/text-file.js'
import BinaryFile from '../interface-types/binary-file.js'
import TextStream from '../interface-types/text-stream.js'
import BinaryStream from '../interface-types/binary-stream.js'
import Image from '../interface-types/image.js'
import Mesh from '../interface-types/mesh.js'
import PointSet from '../interface-types/point-set.js'
import PolyData from '../interface-types/poly-data.js'
import Transform from '../interface-types/transform.js'
import JsonCompatible from '../interface-types/json-compatible.js'

interface PipelineInput {
  type: (typeof InterfaceTypes)[keyof typeof InterfaceTypes]
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
    | PointSet
    | PolyData
    | Transform
}

export default PipelineInput
