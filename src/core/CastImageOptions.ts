import IntTypes from './IntTypes.js'
import FloatTypes from './FloatTypes.js'
import PixelTypes from './PixelTypes.js'

interface CastImageOptions {
  /** Component type, from itk-wasm IntTypes, FloatTypes, for the output pixel components. Defaults to the input component type. */
  componentType?: typeof IntTypes[keyof typeof IntTypes] | typeof FloatTypes[keyof typeof FloatTypes]

  /** Pixel type, from itk-wasm PixelTypes, for the output pixels. Defaults to the input pixel type. */
  pixelType?: typeof PixelTypes[keyof typeof PixelTypes]
}

export default CastImageOptions
