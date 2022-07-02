import ImageType from './ImageType.js'
import type TypedArray from './TypedArray.js'
import setMatrixElement from './setMatrixElement.js'
import Metadata from './Metadata.js'

class Image {
  name: string = 'image'

  origin: number[]

  spacing: number[]

  direction: TypedArray

  size: number[]

  metadata: Metadata

  data: null | TypedArray

  constructor (public readonly imageType = new ImageType()) {
    const dimension = imageType.dimension
    this.origin = new Array(dimension)
    this.origin.fill(0.0)

    this.spacing = new Array(dimension)
    this.spacing.fill(1.0)

    this.direction = new Float64Array(dimension * dimension)
    this.direction.fill(0.0)
    for (let ii = 0; ii < dimension; ii++) {
      setMatrixElement(this.direction, dimension, ii, ii, 1.0)
    }

    this.size = new Array(dimension)
    this.size.fill(0)

    this.metadata = new Map()

    this.data = null
  }
}

export default Image
