import test from 'ava'
import { castImageNode } from '../dist/itk-cast-image.node.js'
import { Image, ImageType, IntTypes, FloatTypes, PixelTypes } from 'itk-wasm'

test('castImageNode Scalar identity', async t => {
  const imageType = new ImageType(2, IntTypes.UInt8, PixelTypes.Scalar, 1)
  const image = new Image(imageType)
  image.size = [256, 256]
  image.data = new Uint8Array(256*256)
  image.data.fill(7)

  const { outputImage } = await castImageNode(image)

  t.assert(outputImage.imageType.pixelType === PixelTypes.Scalar)
  t.assert(outputImage.imageType.componentType === IntTypes.UInt8)
  t.deepEqual(outputImage.data, image.data)
})


test('castImageNode Scalar Float32', async t => {
  const imageType = new ImageType(2, IntTypes.UInt8, PixelTypes.Scalar, 1)
  const image = new Image(imageType)
  image.size = [256, 256]
  image.data = new Uint8Array(256*256)
  image.data.fill(7)

  const { outputImage } = await castImageNode(image, { componentType: FloatTypes.Float32 })

  t.assert(outputImage.imageType.pixelType === PixelTypes.Scalar)
  t.assert(outputImage.imageType.componentType === FloatTypes.Float32)
  t.deepEqual(new Uint8Array(outputImage.data), image.data)
})


// test('castImageNode VectorImage identity', async t => {
//   const imageType = new ImageType(2, IntTypes.UInt8, PixelTypes.VariableLengthVector, 2)
//   const image = new Image(imageType)
//   image.size = [256, 256]
//   image.data = new Uint8Array(256*256 * 2)
//   image.data.fill(7)
//   console.log(image)

//   const { outputImage } = await castImageNode(image)

//   t.assert(outputImage.imageType.pixelType === PixelTypes.VariableLengthVector)
//   t.assert(outputImage.imageType.componentType === IntTypes.UInt8)
//   t.deepEqual(outputImage.data, image.data)
// })

