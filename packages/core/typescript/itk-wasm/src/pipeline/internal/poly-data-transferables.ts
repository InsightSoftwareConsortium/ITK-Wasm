import PolyData from '../../interface-types/poly-data.js'
import TypedArray from '../../typed-array.js'

function polyDataTransferables (polyData: PolyData): Array<ArrayBuffer | TypedArray | null> {
  return [
    polyData.points,
    polyData.vertices,
    polyData.lines,
    polyData.polygons,
    polyData.triangleStrips,
    polyData.pointData,
    polyData.cellData
  ]
}

export default polyDataTransferables
