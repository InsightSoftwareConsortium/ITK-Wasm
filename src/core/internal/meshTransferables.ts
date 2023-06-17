import Mesh from '../Mesh.js'
import TypedArray from '../TypedArray.js'

function meshTransferables (mesh: Mesh): (TypedArray | null)[] {
  return [
    mesh.points,
    mesh.pointData,
    mesh.cells,
    mesh.cellData,
  ]
}

export default meshTransferables
