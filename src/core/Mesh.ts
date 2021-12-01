import MeshType from './MeshType.js'
import type TypedArray from './TypedArray.js'

class Mesh {
  meshType: typeof MeshType

  name: string = 'Mesh'

  numberOfPoints: number
  points: null | TypedArray

  numberOfPointPixels: number
  pointData: null | TypedArray

  numberOfCells: number
  cells: null | TypedArray
  cellBufferSize: number

  numberOfCellPixels: number
  cellData: null | TypedArray

  constructor (public readonly meshType = new MeshType()) {
    this.meshType = meshType

    this.name = 'Mesh'

    this.numberOfPoints = 0
    this.points = null

    this.numberOfPointPixels = 0
    this.pointData = null

    this.numberOfCells = 0
    this.cellBufferSize = 0
    this.cells = null

    this.numberOfCellPixels = 0
    this.cellData = null
  }
}

export default Mesh
