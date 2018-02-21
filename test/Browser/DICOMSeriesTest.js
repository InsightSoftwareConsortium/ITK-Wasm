const test = require('tape')
const axios = require('axios')

const IntTypes = require('IntTypes.js')
const PixelTypes = require('PixelTypes.js')
const readImageDICOMFileSeries = require('readImageDICOMFileSeries.js')

const getMatrixElement = require('getMatrixElement.js')

test('Test reading DICOM file series', t => {
  const testSeriesDirectory = 'base/build/ExternalData/test/Input/DicomImageOrientationTest/'
  const fileNames = ['ImageOrientation.1.dcm', 'ImageOrientation.2.dcm', 'ImageOrientation.3.dcm']
  const fetchFiles = fileNames.map(function (file) {
    const path = testSeriesDirectory + file
    return axios.get(path, { responseType: 'blob' }).then(function (response) {
      const jsFile = new window.File([response.data], file)
      return jsFile
    })
  })

  return Promise.all(fetchFiles)
    .then(function (files) {
      return readImageDICOMFileSeries(files)
    })
    .then(function (image) {
      t.is(image.imageType.dimension, 3, 'dimension')
      t.is(image.imageType.componentType, IntTypes.UInt8, 'componentType')
      t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
      t.is(image.imageType.components, 1, 'components')
      t.is(image.origin[0], -17.355100631713867, 'origin[0]')
      t.is(image.origin[1], -133.92860412597656, 'origin[1]')
      t.is(image.origin[2], 116.78569793701172, 'origin[2]')
      t.is(image.spacing[0], 1.0, 'spacing[0]')
      t.is(image.spacing[1], 1.0, 'spacing[1]')
      t.is(image.spacing[2], 1.2999992370605469, 'spacing[2]')
      t.is(getMatrixElement(image.direction, 0, 0), 0.0, 'direction (0, 0)')
      t.is(getMatrixElement(image.direction, 0, 1), 0.0, 'direction (0, 1)')
      t.is(getMatrixElement(image.direction, 0, 2), -1.0, 'direction (0, 2)')
      t.is(getMatrixElement(image.direction, 1, 0), 1.0, 'direction (1, 0)')
      t.is(getMatrixElement(image.direction, 1, 1), 0.0, 'direction (1, 1)')
      t.is(getMatrixElement(image.direction, 1, 2), 0.0, 'direction (1, 2)')
      t.is(getMatrixElement(image.direction, 2, 0), 0.0, 'direction (2, 0)')
      t.is(getMatrixElement(image.direction, 2, 1), -1.0, 'direction (2, 1)')
      t.is(getMatrixElement(image.direction, 2, 2), 0.0, 'direction (2, 2)')
      t.is(image.size[0], 256, 'size[0]')
      t.is(image.size[1], 256, 'size[1]')
      t.is(image.size[2], 3, 'size[2]')
      t.is(image.data.length, 3 * 65536, 'data.length')
      t.is(image.data[1000], 5, 'data[1000]')
      t.end()
    })
})
