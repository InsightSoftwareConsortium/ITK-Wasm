import Image from './Image.js'
import Matrix from './Matrix.js'

function copyImage (image: Image): Image {
  const copy = new Image(image.imageType)
  copy.name = image.name
  const dimension = image.imageType.dimension

  copy.origin = Array.from(image.origin)
  copy.spacing = Array.from(image.spacing)
  copy.direction = new Matrix(dimension, dimension)
  copy.direction.data = Array.from(image.direction.data)

  copy.size = Array.from(image.size)

  if (image.data !== null) {
    const ctor = image.data.constructor as new(length: number) => typeof image.data
    copy.data = new ctor(image.data.length)
    if (copy.data != null) {
      // @ts-expect-error: error TS2345: Argument of type 'TypedArray' is not assignable to parameter of type 'ArrayLike<number> & ArrayLike<bigint>'
      copy.data.set(image.data, 0)
    }
  }

  return copy
}

export default copyImage
