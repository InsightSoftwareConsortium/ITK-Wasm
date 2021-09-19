import IntTypes, { UInt8 } from './IntTypes.js'
import PixelTypes, { Scalar } from './PixelTypes.js'

class ImageType {
  constructor(
    public readonly dimension: number = 2,
    public readonly componentType: IntTypes = UInt8,
    public readonly pixelType: PixelTypes = Scalar,
    public readonly components: number = 1
  ) {}
}

export default ImageType
