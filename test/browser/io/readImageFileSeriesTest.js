import test from 'tape'
import axios from 'axios'

import { IntTypes, PixelTypes, getMatrixElement, readImageFileSeries } from 'browser/index.js'

export default function () {
  function verifyImage (t, image) {
    t.is(image.imageType.dimension, 3, 'dimension')
    t.is(image.imageType.componentType, IntTypes.UInt16, 'componentType')
    t.is(image.imageType.pixelType, PixelTypes.Scalar, 'pixelType')
    t.is(image.imageType.components, 1, 'components')
    t.is(image.origin[0], 0.0, 'origin[0]')
    t.is(image.origin[1], 0.0, 'origin[1]')
    t.is(image.origin[2], 2.0, 'origin[2]')
    t.is(image.spacing[0], 0.85935, 'spacing[0]')
    t.is(image.spacing[1], 0.85935, 'spacing[1]')
    t.is(image.spacing[2], 3.0, 'spacing[2]')
    t.is(getMatrixElement(image.direction, 3, 0, 0), 1.0, 'direction (0, 0)')
    t.is(getMatrixElement(image.direction, 3, 0, 1), 0.0, 'direction (0, 1)')
    t.is(getMatrixElement(image.direction, 3, 0, 2), 0.0, 'direction (0, 2)')
    t.is(getMatrixElement(image.direction, 3, 1, 0), 0.0, 'direction (1, 0)')
    t.is(getMatrixElement(image.direction, 3, 1, 1), 1.0, 'direction (1, 1)')
    t.is(getMatrixElement(image.direction, 3, 1, 2), 0.0, 'direction (1, 2)')
    t.is(getMatrixElement(image.direction, 3, 2, 0), 0.0, 'direction (2, 0)')
    t.is(getMatrixElement(image.direction, 3, 2, 1), 0.0, 'direction (2, 1)')
    t.is(getMatrixElement(image.direction, 3, 2, 2), 1.0, 'direction (2, 2)')
    t.is(image.size[0], 256, 'size[0]')
    t.is(image.size[1], 256, 'size[1]')
    t.is(image.size[2], 3, 'size[2]')
    t.is(image.data.length, 3 * 65536, 'data.length')
    t.is(image.data[1000], 0, 'data[1000]')
  }

  const zSpacing = 3.0
  const zOrigin = 2.0
  function fetchTestFiles (fileNames) {
    const testSeriesDirectory = 'base/build-emscripten/ExternalData/test/Input/PNGSeries/'
    const fetchFiles = fileNames.map(function (file) {
      const path = testSeriesDirectory + file
      return axios.get(path, { responseType: 'blob' }).then(function (response) {
        const jsFile = new window.File([response.data], file)
        return jsFile
      })
    })
    return fetchFiles
  }

  test('Test reading sorted PNG file series', t => {
    const fileNames = ['mri3D_01.png', 'mri3D_02.png', 'mri3D_03.png']
    const fetchFiles = fetchTestFiles(fileNames)
    const sortedSeries = true

    return Promise.all(fetchFiles)
      .then(function (files) {
        return readImageFileSeries(files, zSpacing, zOrigin, sortedSeries)
      })
      .then(function ({ image, webWorkerPool }) {
        webWorkerPool.terminateWorkers()
        verifyImage(t, image)
        t.end()
      })
  })

  test('Test reading unsorted PNG file series', t => {
    const fileNames = ['mri3D_02.png', 'mri3D_01.png', 'mri3D_03.png']
    const fetchFiles = fetchTestFiles(fileNames)

    return Promise.all(fetchFiles)
      .then(function (files) {
        return readImageFileSeries(files, zSpacing, zOrigin)
      })
      .then(function ({ image, webWorkerPool }) {
        webWorkerPool.terminateWorkers()
        verifyImage(t, image)
        t.end()
      })
  })
}
