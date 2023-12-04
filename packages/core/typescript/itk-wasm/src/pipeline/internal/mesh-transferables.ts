import Mesh from '../../interface-types/mesh.js'
import TypedArray from '../../typed-array.js'

function meshTransferables (mesh: Mesh): Array<TypedArray | null> {
  return [
    mesh.points,
    mesh.pointData,
    mesh.cells,
    mesh.cellData
  ]
}

export default meshTransferables
