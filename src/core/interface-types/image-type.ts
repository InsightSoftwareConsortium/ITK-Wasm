import IntTypes from './int-types.js'
import FloatTypes from './float-types.js'
import PixelTypes from './pixel-types.js'

class ImageType {
  constructor (
    public readonly dimension: number = 2,
    public readonly componentType: typeof IntTypes[keyof typeof IntTypes] | typeof FloatTypes[keyof typeof FloatTypes] = IntTypes.UInt8,
    public readonly pixelType: typeof PixelTypes[keyof typeof PixelTypes] = PixelTypes.Scalar,
    public readonly components: number = 1
  ) {}
}

export default ImageType
