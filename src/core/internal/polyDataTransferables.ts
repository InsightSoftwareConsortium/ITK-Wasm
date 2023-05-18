import PolyData from '../PolyData.js'
import getTransferable from '../getTransferable.js'

function polyDataTransferables (polyData: PolyData): ArrayBuffer[] {
  const transferables: ArrayBuffer[] = []
  if (polyData.points != null) {
    let transferable = getTransferable(polyData.points)
    if (transferable != null) {
      transferables.push(transferable)
    }
  }
  if (polyData.vertices != null) {
    let transferable = getTransferable(polyData.vertices)
    if (transferable != null) {
      transferables.push(transferable)
    }
  }
  if (polyData.lines != null) {
    let transferable = getTransferable(polyData.lines)
    if (transferable != null) {
      transferables.push(transferable)
    }
  }
  if (polyData.polygons != null) {
    let transferable = getTransferable(polyData.polygons)
    if (transferable != null) {
      transferables.push(transferable)
    }
  }
  if (polyData.triangleStrips != null) {
    let transferable = getTransferable(polyData.triangleStrips)
    if (transferable != null) {
      transferables.push(transferable)
    }
  }
  if (polyData.pointData != null) {
    let transferable = getTransferable(polyData.pointData)
    if (transferable != null) {
      transferables.push(transferable)
    }
  }
  if (polyData.cellData != null) {
    let transferable = getTransferable(polyData.cellData)
    if (transferable != null) {
      transferables.push(transferable)
    }
  }

  return transferables
}

export default polyDataTransferables
