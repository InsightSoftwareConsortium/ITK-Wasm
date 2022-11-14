import Image from './Image.js'
import CastImageOptions from './CastImageOptions.js'
import PixelTypes from './PixelTypes.js'
import IntTypes from './IntTypes.js'
import FloatTypes from './FloatTypes.js'

/**
 * Cast an image to another PixelType or ComponentType
 *
 * @param {Image} image - The input image
 * @param {CastImageOptions} options - specify the componentType and/or pixelType of the output
 */
function castImage (inputImage: Image, options?: CastImageOptions): Image {
  const outputImageType = { ...inputImage.imageType }

  if (typeof options !== 'undefined' && typeof options.pixelType !== 'undefined') {
    outputImageType.pixelType = options.pixelType
    if (options.pixelType === PixelTypes.Scalar && outputImageType.components !== 1) {
      throw new Error('Cannot cast multi-component image to a scalar image')
    }
  }
  if (typeof options !== 'undefined' && typeof options.componentType !== 'undefined' && options.componentType !== inputImage.imageType.componentType) {
    outputImageType.componentType = options.componentType
  }

  const outputImage = new Image(outputImageType)

  outputImage.name = inputImage.name
  outputImage.origin = Array.from(inputImage.origin)
  outputImage.spacing = Array.from(inputImage.spacing)
  outputImage.direction = inputImage.direction.slice()
  outputImage.size = Array.from(inputImage.size)
  // Deep copy the map
  outputImage.metadata = new Map(JSON.parse(JSON.stringify(Array.from(inputImage.metadata))))

  if (inputImage.data !== null) {
    if (typeof options !== 'undefined' && typeof options.componentType !== 'undefined' && options.componentType !== inputImage.imageType.componentType) {
      switch (inputImage.imageType.componentType) {
        case IntTypes.UInt8:
        case IntTypes.Int8:
        case IntTypes.UInt16:
        case IntTypes.Int16:
        case IntTypes.UInt32:
        case IntTypes.Int32:
        case FloatTypes.Float32:
        case FloatTypes.Float64:
          switch (outputImage.imageType.componentType) {
            case IntTypes.UInt8:
              outputImage.data = new Uint8Array(inputImage.data)
              break
            case IntTypes.Int8:
              outputImage.data = new Int8Array(inputImage.data)
              break
            case IntTypes.UInt16:
              outputImage.data = new Uint16Array(inputImage.data)
              break
            case IntTypes.Int16:
              outputImage.data = new Int16Array(inputImage.data)
              break
            case IntTypes.UInt32:
              outputImage.data = new Uint32Array(inputImage.data)
              break
            case IntTypes.Int32:
              outputImage.data = new Int32Array(inputImage.data)
              break
            case FloatTypes.Float32:
              outputImage.data = new Float32Array(inputImage.data)
              break
            case FloatTypes.Float64:
              outputImage.data = new Float64Array(inputImage.data)
              break
            case IntTypes.UInt64:
              outputImage.data = new BigUint64Array(inputImage.data.length)
              for (let idx = 0; idx < outputImage.data.length; idx++) {
                outputImage.data[idx] = BigInt.asIntN(64, BigInt(inputImage.data[idx]))
              }
              break
            case IntTypes.Int64:
              outputImage.data = new BigInt64Array(inputImage.data.length)
              for (let idx = 0; idx < outputImage.data.length; idx++) {
                outputImage.data[idx] = BigInt.asUintN(64, BigInt(inputImage.data[idx]))
              }
              break
          }
          break
        case IntTypes.UInt64:
        case IntTypes.Int64:
          switch (outputImage.imageType.componentType) {
            case IntTypes.UInt8:
              outputImage.data = new Uint8Array(inputImage.data.length)
              for (let idx = 0; idx < outputImage.data.length; idx++) {
                outputImage.data[idx] = Number(inputImage.data[idx])
              }
              break
            case IntTypes.Int8:
              outputImage.data = new Int8Array(inputImage.data.length)
              for (let idx = 0; idx < outputImage.data.length; idx++) {
                outputImage.data[idx] = Number(inputImage.data[idx])
              }
              break
            case IntTypes.UInt16:
              outputImage.data = new Uint16Array(inputImage.data.length)
              for (let idx = 0; idx < outputImage.data.length; idx++) {
                outputImage.data[idx] = Number(inputImage.data[idx])
              }
              break
            case IntTypes.Int16:
              outputImage.data = new Int16Array(inputImage.data.length)
              for (let idx = 0; idx < outputImage.data.length; idx++) {
                outputImage.data[idx] = Number(inputImage.data[idx])
              }
              break
            case IntTypes.UInt32:
              outputImage.data = new Uint32Array(inputImage.data.length)
              for (let idx = 0; idx < outputImage.data.length; idx++) {
                outputImage.data[idx] = Number(inputImage.data[idx])
              }
              break
            case IntTypes.Int32:
              outputImage.data = new Int32Array(inputImage.data.length)
              for (let idx = 0; idx < outputImage.data.length; idx++) {
                outputImage.data[idx] = Number(inputImage.data[idx])
              }
              break
            case FloatTypes.Float32:
              outputImage.data = new Float32Array(inputImage.data.length)
              for (let idx = 0; idx < outputImage.data.length; idx++) {
                outputImage.data[idx] = Number(inputImage.data[idx])
              }
              break
            case FloatTypes.Float64:
              outputImage.data = new Float64Array(inputImage.data.length)
              for (let idx = 0; idx < outputImage.data.length; idx++) {
                outputImage.data[idx] = Number(inputImage.data[idx])
              }
              break
            case IntTypes.UInt64:
              outputImage.data = new BigUint64Array(inputImage.data)
              break
            case IntTypes.Int64:
              outputImage.data = new BigInt64Array(inputImage.data)
              break
          }
          break
      }
    } else {
      // copy
      const CTor = inputImage.data.constructor as new(length: number) => typeof inputImage.data
      outputImage.data = new CTor(inputImage.data.length)
      if (outputImage.data != null) {
        // @ts-expect-error: error TS2345: Argument of type 'TypedArray' is not assignable to parameter of type 'ArrayLike<number> & ArrayLike<bigint>'
        outputImage.data.set(inputImage.data, 0)
      }
    }
  }

  return outputImage
}

export default castImage
