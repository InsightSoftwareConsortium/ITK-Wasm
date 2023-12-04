import IntTypes from './interface-types/int-types.js'
import FloatTypes from './interface-types/float-types.js'
import PixelTypes from './interface-types/pixel-types.js'

interface CastImageOptions {
  /** Component type, from itk-wasm IntTypes, FloatTypes, for the output pixel components. Defaults to the input component type. */
  componentType?: typeof IntTypes[keyof typeof IntTypes] | typeof FloatTypes[keyof typeof FloatTypes]

  /** Pixel type, from itk-wasm PixelTypes, for the output pixels. Defaults to the input pixel type. */
  pixelType?: typeof PixelTypes[keyof typeof PixelTypes]
}

export default CastImageOptions
