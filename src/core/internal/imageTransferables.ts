import Image from '../Image.js'
import TypedArray from '../TypedArray.js'

function imageTransferables (image: Image): Array<TypedArray | null> {
  return [
    image.data,
    image.direction
  ]
}

export default imageTransferables
