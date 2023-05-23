import Mesh from '../Mesh.js'
import getTransferable from '../getTransferable.js'

function meshTransferables (mesh: Mesh): ArrayBuffer[] {
  const transferables: ArrayBuffer[] = []
  if (mesh.points != null) {
    const transferable = getTransferable(mesh.points)
    if (transferable != null) {
      transferables.push(transferable)
    }
  }
  if (mesh.pointData != null) {
    const transferable = getTransferable(mesh.pointData)
    if (transferable != null) {
      transferables.push(transferable)
    }
  }
  if (mesh.cells != null) {
    const transferable = getTransferable(mesh.cells)
    if (transferable != null) {
      transferables.push(transferable)
    }
  }
  if (mesh.cellData != null) {
    const transferable = getTransferable(mesh.cellData)
    if (transferable != null) {
      transferables.push(transferable)
    }
  }

  return transferables
}

export default meshTransferables
