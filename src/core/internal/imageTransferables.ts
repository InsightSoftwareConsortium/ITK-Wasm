import Image from '../Image.js'
import TypedArray from '../TypedArray.js'

function imageTransferables (image: Image): (TypedArray | null)[] {
  return [
    image.data,
    image.direction,
  ]
}

export default imageTransferables
