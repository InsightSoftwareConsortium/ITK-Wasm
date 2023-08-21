import {
  Image,
  FloatTypes,
  PixelTypes,
  castImage,
} from 'itk-wasm'

import VectorMagnitudeNodeResult from './vector-magnitude-node-result'

async function toScalarDouble(vectorMagnitudeFn: (img: Image) => Promise<VectorMagnitudeNodeResult>, image: Image): Promise<Image> {
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
    const magnitude = await vectorMagnitudeFn(scalarDouble)
    scalarDouble = magnitude.magnitudeImage
  }

  return scalarDouble
}

export default toScalarDouble
