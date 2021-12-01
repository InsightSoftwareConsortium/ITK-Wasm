import { TypedArray } from "./TypedArray.js"

class PolyData {
  name: string = 'PolyData'

  points: Float32Array

  vertices: null | Uint32Array

  lines: null | Uint32Array

  polygons: null | Uint32Array

  triangleStrips: null | Uint32Array

  pointData: null | TypedArray

  cellData: null | TypedArray

  constructor () {
    this.name = 'PolyData'

    this.points = new Float32Array()
    this.lines = null
    this.vertices = null
    this.polygons = null
    this.triangleStrips = null
    this.pointData = null
    this.cellData = null
  }
}

export default PolyData
