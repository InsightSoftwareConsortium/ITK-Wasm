import { PixelTypes } from "../../../dist"
import compareImageToBaseline from "../../support/compareImageToBaseline"

describe('castImage', () => {
  beforeEach(() => {
    cy.visit('/')
  })


  it('copies the input when no options are passed', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const inputImageType = new itk.ImageType()
      const inputImage = new itk.Image(inputImageType)
      inputImage.size = [256, 256]
      inputImage.data = new Uint8Array(256*256)
      inputImage.data.fill(7)
      inputImage.origin = [3.0, 4.0]
      inputImage.spacing = [9.0, 4.0]
      inputImage.direction[0] = -1.0

      const outputImage = itk.castImage(inputImage, {})

      compareImageToBaseline(itk, outputImage, inputImage)
    })
  })


  it('casts to the specified pixel type', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const inputImageType = new itk.ImageType()
      const inputImage = new itk.Image(inputImageType)
      inputImage.size = [256, 256]
      inputImage.data = new Uint8Array(256*256)
      inputImage.data.fill(7)

      const outputImage = itk.castImage(inputImage, { pixelType: itk.PixelTypes.CovariantVector })

      const baseline = inputImage
      baseline.imageType.pixelType = itk.PixelTypes.CovariantVector

      compareImageToBaseline(itk, outputImage, baseline)
    })
  })


  it('throws an error when casting a multi-component image to a scalar image', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const inputImageType = new itk.ImageType(2, itk.IntTypes.UInt8, itk.PixelTypes.Complex, 2)
      const inputImage = new itk.Image(inputImageType)
      inputImage.size = [256, 256]
      inputImage.data = new Uint8Array(256*256 * 2)
      inputImage.data.fill(7)

      expect(() => {
        itk.castImage(inputImage, { pixelType: itk.PixelTypes.Scalar })
      }).to.throw()
    })
  })

  it('casts to another TypedArray component type', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const inputImageType = new itk.ImageType()
      const inputImage = new itk.Image(inputImageType)
      inputImage.size = [256, 256]
      inputImage.data = new Uint8Array(256*256)
      inputImage.data.fill(7)

      const outputImage = itk.castImage(inputImage, { componentType: itk.FloatTypes.Float32 })

      const baseline = inputImage
      baseline.imageType.componentType = itk.FloatTypes.Float32
      baseline.data = new Float32Array(baseline.data)

      compareImageToBaseline(itk, outputImage, baseline)
    })
  })

  it('casts to a 64-bit integer component type', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const inputImageType = new itk.ImageType()
      const inputImage = new itk.Image(inputImageType)
      inputImage.size = [256, 256]
      inputImage.data = new Uint8Array(256*256)
      inputImage.data.fill(7)

      const outputImage = itk.castImage(inputImage, { componentType: itk.IntTypes.UInt64 })

      const baseline = inputImage
      baseline.imageType.componentType = itk.IntTypes.UInt64
      baseline.data = new BigUint64Array(baseline.data.length)
      baseline.data.fill(7n)

      compareImageToBaseline(itk, outputImage, baseline)
    })
  })

  it('casts from 64-bit to TypedArray component type', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const inputImageType = new itk.ImageType(2, itk.IntTypes.UInt64, itk.PixelTypes.Scalar, 1)
      const inputImage = new itk.Image(inputImageType)
      inputImage.size = [256, 256]
      inputImage.data = new BigUint64Array(256*256)
      inputImage.data.fill(7n)

      const outputImage = itk.castImage(inputImage, { componentType: itk.FloatTypes.Float32 })

      const baseline = inputImage
      baseline.imageType.componentType = itk.FloatTypes.Float32
      baseline.data = new Float32Array(baseline.data.length)
      baseline.data.fill(7)

      compareImageToBaseline(itk, outputImage, baseline)
    })
  })

  it('casts from 64-bit to another 64-bit integer component type', () => {
    cy.window().then(async (win) => {
      const itk = win.itk

      const inputImageType = new itk.ImageType()
      const inputImage = new itk.Image(inputImageType)
      inputImage.size = [256, 256]
      inputImage.data = new BigInt64Array(256*256)
      inputImage.data.fill(7n)

      const outputImage = itk.castImage(inputImage, { componentType: itk.IntTypes.UInt64 })

      const baseline = inputImage
      baseline.imageType.componentType = itk.IntTypes.UInt64
      baseline.data = new BigUint64Array(baseline.data.length)
      baseline.data.fill(7n)

      compareImageToBaseline(itk, outputImage, baseline)
    })
  })
})
