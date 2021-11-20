class PolyData {
  name: string = 'PolyData'

  points: Float32Array

  vertices: null | Uint32Array

  lines: null | Uint32Array

  polygons: null | Uint32Array

  triangleStrips: null | Uint32Array

  constructor () {
    this.name = 'PolyData'

    this.points = new Float32Array()
    this.lines = null
    this.vertices = null
    this.polygons = null
    this.triangleStrips = null
  }
}

export default PolyData
