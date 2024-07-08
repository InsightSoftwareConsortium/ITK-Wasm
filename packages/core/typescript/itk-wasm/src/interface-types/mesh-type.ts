import IntTypes from './int-types.js'
import FloatTypes from './float-types.js'
import PixelTypes from './pixel-types.js'

class MeshType {
  constructor (
    public readonly dimension: number = 2,
    public readonly pointComponentType: (typeof FloatTypes)[keyof typeof FloatTypes] = FloatTypes.Float32,
    public readonly pointPixelComponentType:
    | (typeof IntTypes)[keyof typeof IntTypes]
    | (typeof FloatTypes)[keyof typeof FloatTypes] = FloatTypes.Float32,
    public readonly pointPixelType: (typeof PixelTypes)[keyof typeof PixelTypes] = PixelTypes.Scalar,
    public readonly pointPixelComponents: number = 1,
    public readonly cellComponentType: (typeof IntTypes)[keyof typeof IntTypes] = IntTypes.Int32,
    public readonly cellPixelComponentType:
    | (typeof IntTypes)[keyof typeof IntTypes]
    | (typeof FloatTypes)[keyof typeof FloatTypes] = FloatTypes.Float32,
    public readonly cellPixelType: (typeof PixelTypes)[keyof typeof PixelTypes] = PixelTypes.Scalar,
    public readonly cellPixelComponents: number = 1
  ) {}
}

export default MeshType
