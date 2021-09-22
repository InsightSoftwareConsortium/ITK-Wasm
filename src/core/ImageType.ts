import IntTypes from './IntTypes.js'
import PixelTypes from './PixelTypes.js'

class ImageType {
  constructor(
    public readonly dimension: number = 2,
    public readonly componentType: typeof IntTypes[keyof typeof IntTypes] = IntTypes.UInt8,
    public readonly pixelType: typeof PixelTypes[keyof typeof PixelTypes] = PixelTypes.Scalar,
    public readonly components: number = 1
  ) {}
}

export default ImageType
