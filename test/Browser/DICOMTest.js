import test from 'tape'
import axios from 'axios'

import IntTypes from 'IntTypes'
import PixelTypes from 'PixelTypes'
import readImageFile from 'readImageFile'

import getMatrixElement from 'getMatrixElement'

test('Test reading a DICOM file', t => {
  const fileName = '1.3.6.1.4.1.5962.99.1.3814087073.479799962.1489872804257.100.0.dcm'
  const testFilePath = 'base/build/ExternalData/test/Input/' + fileName
  return axios.get(testFilePath, { responseType: 'blob' }).then(function (response) {
    const jsFile = new window.File([response.data], fileName)
    return jsFile
  })
    .then(function (jsFile) {
      return readImageFile(null, jsFile)
    }).then(function ({ image, webWorker }) {
      webWorker.terminate()
      t.is(image.imageType.dimension, 3, 'dimension')
      t.is(image.imageType.componentType, IntTypes.UInt8, 'componentType')
      t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
      t.is(image.imageType.components, 1, 'components')
      t.is(image.origin[0], -32.9551, 'origin[0]')
      t.is(image.origin[1], -133.9286, 'origin[1]')
      t.is(image.origin[2], 116.7857, 'origin[2]')
      t.is(image.spacing[0], 1.0, 'spacing[0]')
      t.is(image.spacing[1], 1.0, 'spacing[1]')
      t.is(image.spacing[2], 1.0, 'spacing[2]')
      t.is(getMatrixElement(image.direction, 0, 0), 0.0, 'direction (0, 0)')
      t.is(getMatrixElement(image.direction, 0, 1), -0.0, 'direction (0, 1)')
      t.is(getMatrixElement(image.direction, 0, 2), -1.0, 'direction (0, 2)')
      t.is(getMatrixElement(image.direction, 1, 0), 1.0, 'direction (1, 0)')
      t.is(getMatrixElement(image.direction, 1, 1), 0.0, 'direction (1, 1)')
      t.is(getMatrixElement(image.direction, 1, 2), 0.0, 'direction (1, 2)')
      t.is(getMatrixElement(image.direction, 2, 0), 0.0, 'direction (2, 0)')
      t.is(getMatrixElement(image.direction, 2, 1), -1.0, 'direction (2, 1)')
      t.is(getMatrixElement(image.direction, 2, 2), 0.0, 'direction (2, 2)')
      t.is(image.size[0], 256, 'size[0]')
      t.is(image.size[1], 256, 'size[1]')
      t.is(image.size[2], 1, 'size[2]')
      t.is(image.data.length, 65536, 'data.length')
      t.is(image.data[1000], 3, 'data[1000]')
      t.end()
    })
})
