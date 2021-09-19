import ImageType from './ImageType.js'
import Matrix from './Matrix.js'
import type TypedArray from './TypedArray.js'

class Image {
  name: string = 'Image'

  origin: number[]

  spacing: number[]

  direction: Matrix

  size: number[]

  data: null | TypedArray

  constructor(public readonly imageType = new ImageType()) {
    const dimension = imageType.dimension
    this.origin = new Array(dimension)
    this.origin.fill(0.0)

    this.spacing = new Array(dimension)
    this.spacing.fill(1.0)

    this.direction = new Matrix(dimension, dimension)
    this.direction.setIdentity()

    this.size = new Array(dimension)
    this.size.fill(0)

    this.data = null
  }
}

export default Image
