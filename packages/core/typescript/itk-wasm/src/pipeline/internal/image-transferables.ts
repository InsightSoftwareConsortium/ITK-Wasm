import Image from '../../interface-types/image.js'
import TypedArray from '../../typed-array.js'

function imageTransferables (image: Image): Array<TypedArray | null> {
  return [
    image.data,
    image.direction
  ]
}

export default imageTransferables
