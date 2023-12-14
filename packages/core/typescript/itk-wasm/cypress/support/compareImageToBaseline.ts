const compareImageToBaseline = (itk, testImage, baselineImage) => {
  expect(testImage.imageType, 'imageType').to.deep.equal(baselineImage.imageType)
  expect(testImage.origin, 'origin').to.deep.equal(baselineImage.origin)
  expect(testImage.spacing, 'spacing').to.deep.equal(baselineImage.spacing)
  expect(testImage.size, 'size').to.deep.equal(baselineImage.size)
  expect(testImage.data, 'data').to.deep.equal(baselineImage.data)
}

export default compareImageToBaseline