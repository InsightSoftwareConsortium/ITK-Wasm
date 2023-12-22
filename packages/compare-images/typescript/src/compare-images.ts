import {
  Image,
} from 'itk-wasm'

import CompareDoubleImagesOptions from './compare-double-images-options.js'
import CompareDoubleImagesResult from './compare-double-images-result.js'
import compareDoubleImages from './compare-double-images.js'

import toScalarDouble from './to-scalar-double.js'
import vectorMagnitude from './vector-magnitude.js'

/**
 * Compare images with a tolerance for regression testing.
 *
 * For multi-component images, the intensity difference threshold
 * is based on the pixel vector magnitude.
 *
 * @param {Image} testImage - The input test image
 * @param {CompareDoubleImagesOptions} options - options object
 *
 * @returns {Promise<CompareDoubleImagesResult>} - result object
 */
async function compareImages(
  testImage: Image,
  options: CompareDoubleImagesOptions = { baselineImages: [] as Image[], }
) : Promise<CompareDoubleImagesResult> {

  async function vectorMagnitudeWorker(image: Image) {
    const { webWorker: usedWebWorker, magnitudeImage } = await vectorMagnitude(image)
    usedWebWorker?.terminate()
    return { magnitudeImage }
  }

  const testImageDouble = await toScalarDouble(vectorMagnitudeWorker, testImage)
  const baselineImagesDouble = await Promise.all(options.baselineImages.map(async (image) => {
    return await toScalarDouble(vectorMagnitudeWorker, image)
  }))

  const otherOptions = { ...options }
  otherOptions.baselineImages = baselineImagesDouble

  return compareDoubleImages(testImageDouble, otherOptions)
}

export default compareImages
