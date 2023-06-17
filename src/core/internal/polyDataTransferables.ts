import PolyData from '../PolyData.js'
import TypedArray from '../TypedArray.js'

function polyDataTransferables (polyData: PolyData): (ArrayBuffer | TypedArray | null)[] {
  return [
    polyData.points,
    polyData.vertices,
    polyData.lines,
    polyData.polygons,
    polyData.triangleStrips,
    polyData.pointData,
    polyData.cellData,
  ]
}

export default polyDataTransferables
