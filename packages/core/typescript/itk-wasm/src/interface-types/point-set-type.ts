import IntTypes from './int-types.js'
import FloatTypes from './float-types.js'
import PixelTypes from './pixel-types.js'

class PointSetType {
  constructor (
    public readonly dimension: number = 3,
    public readonly pointComponentType: (typeof FloatTypes)[keyof typeof FloatTypes] = FloatTypes.Float32,
    public readonly pointPixelComponentType:
    | (typeof IntTypes)[keyof typeof IntTypes]
    | (typeof FloatTypes)[keyof typeof FloatTypes] = FloatTypes.Float32,
    public readonly pointPixelType: (typeof PixelTypes)[keyof typeof PixelTypes] = PixelTypes.Scalar,
    public readonly pointPixelComponents: number = 1
  ) {}
}

export default PointSetType
