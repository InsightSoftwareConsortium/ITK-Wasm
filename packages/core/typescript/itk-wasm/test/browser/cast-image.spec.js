import { test, expect } from '@playwright/test'
import compareImageToBaseline from './compare-image-to-baseline.js'

test.describe('castImage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('copies the input when no options are passed', async ({ page }) => {
    const { outputImage, inputImage: baseline } = await page.evaluate(() => {
      const itk = window.itk

      const inputImageType = new itk.ImageType()
      const inputImage = new itk.Image(inputImageType)
      inputImage.size = [256, 256]
      inputImage.data = new Uint8Array(256 * 256)
      inputImage.data.fill(7)
      inputImage.origin = [3.0, 4.0]
      inputImage.spacing = [9.0, 4.0]
      inputImage.direction.set([-1.0, 0.0, 0.0, -1.0]) // Assuming 2D, ensure full direction matrix

      const outputImage = itk.castImage(inputImage, {})

      // Return both for comparison
      return {
        outputImage: JSON.parse(JSON.stringify(outputImage)),
        inputImage: JSON.parse(JSON.stringify(inputImage))
      }
    })

    compareImageToBaseline(outputImage, baseline)
  })

  test('casts to the specified pixel type', async ({ page }) => {
    const { outputImage, baseline } = await page.evaluate(() => {
      const itk = window.itk

      const inputImageType = new itk.ImageType()
      const inputImage = new itk.Image(inputImageType)
      inputImage.size = [256, 256]
      inputImage.data = new Uint8Array(256 * 256)
      inputImage.data.fill(7)
      // Ensure other properties are set if compareImageToBaseline checks them
      inputImage.origin = [0.0, 0.0]
      inputImage.spacing = [1.0, 1.0]
      inputImage.direction.set([1.0, 0.0, 0.0, 1.0])

      const outputImage = itk.castImage(inputImage, {
        pixelType: itk.PixelTypes.CovariantVector
      })

      const baseline = JSON.parse(JSON.stringify(inputImage)) // Deep copy
      baseline.imageType.pixelType = itk.PixelTypes.CovariantVector
      // Data itself doesn't change type here, just the interpretation if components > 1
      // If compareImageToBaseline relies on data type, this might need adjustment
      // For CovariantVector with 1 component, data remains the same.

      return { outputImage: JSON.parse(JSON.stringify(outputImage)), baseline }
    })

    compareImageToBaseline(outputImage, baseline)
  })

  test('throws an error when casting a multi-component image to a scalar image', async ({
    page
  }) => {
    const errorOccurred = await page.evaluate(() => {
      const itk = window.itk

      const inputImageType = new itk.ImageType(
        2,
        itk.IntTypes.UInt8,
        itk.PixelTypes.Complex,
        2
      )
      const inputImage = new itk.Image(inputImageType)
      inputImage.size = [256, 256]
      inputImage.data = new Uint8Array(256 * 256 * 2 * 2) // Complex has 2 components, and components=2
      inputImage.data.fill(7)
      // Ensure other properties are set
      inputImage.origin = [0.0, 0.0]
      inputImage.spacing = [1.0, 1.0]
      inputImage.direction.set([1.0, 0.0, 0.0, 1.0])

      try {
        itk.castImage(inputImage, { pixelType: itk.PixelTypes.Scalar })
        return false // Should not reach here
      } catch (e) {
        return true
      }
    })
    expect(errorOccurred).toBe(true)
  })

  test('casts to another TypedArray component type', async ({ page }) => {
    const { outputImage, baseline } = await page.evaluate(() => {
      const itk = window.itk

      const inputImageType = new itk.ImageType()
      const inputImage = new itk.Image(inputImageType)
      inputImage.size = [256, 256]
      inputImage.data = new Uint8Array(256 * 256)
      inputImage.data.fill(7)

      const outputImage = itk.castImage(inputImage, {
        componentType: itk.FloatTypes.Float32
      })

      const baseline = inputImage
      baseline.imageType.componentType = itk.FloatTypes.Float32
      baseline.data = new Float32Array(baseline.data)

      return { outputImage, baseline }
    })

    compareImageToBaseline(outputImage, baseline)
  })

  test('casts to a 64-bit integer component type', async ({ page }) => {
    const { outputImage, baseline } = await page.evaluate(() => {
      const itk = window.itk

      const inputImageType = new itk.ImageType()
      const inputImage = new itk.Image(inputImageType)
      inputImage.size = [256, 256]
      inputImage.data = new Uint8Array(256 * 256)
      inputImage.data.fill(7)

      const outputImage = itk.castImage(inputImage, {
        componentType: itk.IntTypes.UInt64
      })

      const baseline = inputImage
      baseline.imageType.componentType = itk.IntTypes.UInt64
      baseline.data = new BigUint64Array(baseline.data.length)
      baseline.data.fill(7n)

      return { outputImage, baseline }
    })

    compareImageToBaseline(outputImage, baseline)
  })

  test('casts from 64-bit to TypedArray component type', async ({ page }) => {
    const { outputImage, baseline } = await page.evaluate(() => {
      const itk = window.itk

      const inputImageType = new itk.ImageType(
        2,
        itk.IntTypes.UInt64,
        itk.PixelTypes.Scalar,
        1
      )
      const inputImage = new itk.Image(inputImageType)
      inputImage.size = [256, 256]
      inputImage.data = new BigUint64Array(256 * 256)
      inputImage.data.fill(7n)

      const outputImage = itk.castImage(inputImage, {
        componentType: itk.FloatTypes.Float32
      })

      const baseline = inputImage
      baseline.imageType.componentType = itk.FloatTypes.Float32
      baseline.data = new Float32Array(baseline.data.length)
      baseline.data.fill(7)

      return { outputImage, baseline }
    })

    compareImageToBaseline(outputImage, baseline)
  })

  test('casts from 64-bit to another 64-bit integer component type', async ({
    page
  }) => {
    const { outputImage, baseline } = await page.evaluate(() => {
      const itk = window.itk

      const inputImageType = new itk.ImageType()
      const inputImage = new itk.Image(inputImageType)
      inputImage.size = [256, 256]
      inputImage.data = new BigInt64Array(256 * 256)
      inputImage.data.fill(7n)

      const outputImage = itk.castImage(inputImage, {
        componentType: itk.IntTypes.UInt64
      })

      const baseline = inputImage
      baseline.imageType.componentType = itk.IntTypes.UInt64
      baseline.data = new BigUint64Array(baseline.data.length)
      baseline.data.fill(7n)

      return { outputImage, baseline }
    })
    compareImageToBaseline(outputImage, baseline)
  })
})
