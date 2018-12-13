import test from 'tape'
import axios from 'axios'

import IntTypes from 'IntTypes'
import PixelTypes from 'PixelTypes'
import readImageFile from 'readImageFile'

import getMatrixElement from 'getMatrixElement'

const verifyImage = (t, image) => {
  t.is(image.imageType.dimension, 2, 'dimension')
  t.is(image.imageType.componentType, IntTypes.UInt8, 'componentType')
  t.is(image.imageType.pixelType, PixelTypes.RGB, 'pixelType')
  t.is(image.imageType.components, 3, 'components')
  t.is(image.origin[0], 0.0, 'origin[0]')
  t.is(image.origin[1], 0.0, 'origin[1]')
  t.is(image.spacing[0], 0.35277777777777775, 'spacing[0]')
  t.is(image.spacing[1], 0.35277777777777775, 'spacing[1]')
  t.is(getMatrixElement(image.direction, 0, 0), 1.0, 'direction (0, 0)')
  t.is(getMatrixElement(image.direction, 0, 1), 0.0, 'direction (0, 1)')
  t.is(getMatrixElement(image.direction, 1, 0), 0.0, 'direction (1, 0)')
  t.is(getMatrixElement(image.direction, 1, 1), 1.0, 'direction (1, 1)')
  t.is(image.size[0], 160, 'size[0]')
  t.is(image.size[1], 179, 'size[1]')
  t.is(image.data.length, 85920, 'data.length')
  t.is(image.data[1000], 255, 'data[1000]')
  t.end()
}

test('Test reading a JPEG file', t => {
  const fileName = 'apple.jpg'
  const testFilePath = 'base/build/ExternalData/test/Input/' + fileName
  return axios.get(testFilePath, { responseType: 'blob' }).then(function (response) {
    const jsFile = new window.File([response.data], fileName)
    return jsFile
  })
    .then(function (jsFile) {
      return readImageFile(jsFile)
    })
    .then(function (image) {
      verifyImage(t, image)
    })
})
