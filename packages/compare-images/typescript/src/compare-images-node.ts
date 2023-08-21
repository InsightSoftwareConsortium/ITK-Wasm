import {
  Image,
} from 'itk-wasm'

import CompareDoubleImagesOptions from './compare-double-images-options.js'
import CompareDoubleImagesNodeResult from './compare-double-images-node-result.js'
import compareDoubleImagesNode from './compare-double-images-node.js'

import toScalarDouble from './to-scalar-double.js'
import vectorMagnitudeNode from './vector-magnitude-node.js'

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

  const testImageDouble = await toScalarDouble(vectorMagnitudeNode, testImage)
  const baselineImagesDouble = await Promise.all(options.baselineImages.map(async (image) => {
    return await toScalarDouble(vectorMagnitudeNode, image)
  }))

  const otherOptions = { ...options }
  otherOptions.baselineImages = baselineImagesDouble

  return compareDoubleImagesNode(testImageDouble, otherOptions)
}

export default compareImagesNode
