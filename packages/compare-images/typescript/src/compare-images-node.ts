import {
  Image,
  FloatTypes,
  PixelTypes,
  castImage,
} from 'itk-wasm'

import CompareDoubleImagesOptions from './compare-double-images-options.js'
import CompareDoubleImagesNodeResult from './compare-double-images-node-result.js'
import compareDoubleImagesNode from './compare-double-images-node.js'
import vectorMagnitudeNode from './vector-magnitude-node.js'

async function _toScalarDouble(image: Image): Promise<Image> {
  let scalarDouble = image

  if (scalarDouble.imageType.componentType !== FloatTypes.Float64) {
    let pixelType = undefined
    if (image.imageType.pixelType !== PixelTypes.Scalar && image.imageType.pixelType !== PixelTypes.VariableLengthVector) {
      pixelType = PixelTypes.VariableLengthVector
    }
    scalarDouble = castImage(image, { componentType: FloatTypes.Float64, pixelType })
  } else {
    if (image.imageType.pixelType !== PixelTypes.Scalar && image.imageType.pixelType !== PixelTypes.VariableLengthVector) {
      const pixelType = PixelTypes.VariableLengthVector
      scalarDouble = castImage(image, { pixelType })
    }
  }

  if (scalarDouble.imageType.pixelType === PixelTypes.VariableLengthVector) {
    const magnitude = await vectorMagnitudeNode(scalarDouble)
    scalarDouble = magnitude.magnitudeImage
  }

  return scalarDouble
}

/**
 * Compare images with a tolerance for regression testing.
 *
 * For multi-component images, the intensity difference threshold
 * is based on the pixel vector magnitude.
 *
 * @param {Image} testImage - The input test image
 * @param {CompareDoubleImagesOptions} options - options object
 *
 * @returns {Promise<CompareDoubleImagesNodeResult>} - result object
 */
async function compareImagesNode(
  testImage: Image,
  options: CompareDoubleImagesOptions = { baselineImages: [] as Image[], }
) : Promise<CompareDoubleImagesNodeResult> {

  const testImageDouble = await _toScalarDouble(testImage)
  const baselineImagesDouble = await Promise.all(options.baselineImages.map(async (image) => {
    return await _toScalarDouble(image)
  }))

  const otherOptions = { ...options }
  otherOptions.baselineImages = baselineImagesDouble

  return compareDoubleImagesNode(testImageDouble, otherOptions)
}

export default compareImagesNode
