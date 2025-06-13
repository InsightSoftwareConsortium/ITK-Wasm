import { expect } from '@playwright/test'

const compareImageToBaseline = (testImage, baselineImage) => {
  expect(testImage.imageType).toEqual(baselineImage.imageType)
  expect(testImage.origin).toEqual(baselineImage.origin)
  expect(testImage.spacing).toEqual(baselineImage.spacing)
  expect(testImage.direction).toEqual(baselineImage.direction)
  expect(testImage.size).toEqual(baselineImage.size)
  expect(testImage.data).toEqual(baselineImage.data)
}

export default compareImageToBaseline
