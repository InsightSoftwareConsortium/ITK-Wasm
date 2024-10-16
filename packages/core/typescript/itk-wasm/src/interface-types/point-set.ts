import PointSetType from './point-set-type.js'
import type TypedArray from '../typed-array.js'

class PointSet {
  name: string = 'PointSet'

  numberOfPoints: number
  points: null | TypedArray

  numberOfPointPixels: number
  pointData: null | TypedArray

  constructor (public readonly pointSetType = new PointSetType()) {
    this.name = 'PointSet'

    this.numberOfPoints = 0
    this.points = null

    this.numberOfPointPixels = 0
    this.pointData = null
  }
}

export default PointSet
