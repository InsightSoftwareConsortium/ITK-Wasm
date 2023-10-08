import { IntTypes, FloatTypes, PixelTypes  } from 'itk-wasm'

interface WriteImageOptions {
  /** Component type, from itk-wasm IntTypes, FloatTypes, for the output pixel components. Defaults to the input component type. */
  componentType?: typeof IntTypes[keyof typeof IntTypes] | typeof FloatTypes[keyof typeof FloatTypes]

  /** Pixel type, from itk-wasm PixelTypes, for the output pixels. Defaults to the input pixel type. */
  pixelType?: typeof PixelTypes[keyof typeof PixelTypes]

  /** Use compression when writing the image if the IO formt supports it. */
  useCompression?: boolean

  /** Mime type of the output image file. */
  mimeType?: boolean
}

export default WriteImageOptions
