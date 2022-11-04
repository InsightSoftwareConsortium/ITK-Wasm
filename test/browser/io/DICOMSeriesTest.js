import test from 'tape'
import axios from 'axios'

import { IntTypes, PixelTypes, getMatrixElement, readImageDICOMFileSeries, readImageDICOMArrayBufferSeries } from '../../../dist/browser/index.js'

const testSeriesDirectory = 'base/build-emscripten/ExternalData/test/Input/DicomImageOrientationTest/'
const fileNames = ['ImageOrientation.1.dcm', 'ImageOrientation.2.dcm', 'ImageOrientation.3.dcm']

function verifyImage (t, image, expectedComponentType, expectedPixelType) {
  t.is(image.imageType.dimension, 3, 'dimension')
  let componentType = IntTypes.Int16
  if (expectedComponentType) {
    componentType = expectedComponentType
  }
  let pixelType = PixelTypes.Scalar
  if (expectedPixelType) {
    pixelType = expectedPixelType
  }
  t.is(image.imageType.componentType, componentType, 'componentType')
  t.is(image.imageType.pixelType, pixelType, 'pixelType')
  t.is(image.imageType.components, 1, 'components')
  t.is(image.origin[0], -17.3551, 'origin[0]')
  t.is(image.origin[1], -133.9286, 'origin[1]')
  t.is(image.origin[2], 116.7857, 'origin[2]')
  t.is(image.spacing[0], 1.0, 'spacing[0]')
  t.is(image.spacing[1], 1.0, 'spacing[1]')
  t.is(image.spacing[2], 1.3000000000000007, 'spacing[2]')
  t.is(getMatrixElement(image.direction, 3, 0, 0), 0.0, 'direction (0, 0)')
  t.is(getMatrixElement(image.direction, 3, 0, 1), 0.0, 'direction (0, 1)')
  t.is(getMatrixElement(image.direction, 3, 0, 2), -1.0, 'direction (0, 2)')
  t.is(getMatrixElement(image.direction, 3, 1, 0), 1.0, 'direction (1, 0)')
  t.is(getMatrixElement(image.direction, 3, 1, 1), 0.0, 'direction (1, 1)')
  t.is(getMatrixElement(image.direction, 3, 1, 2), 0.0, 'direction (1, 2)')
  t.is(getMatrixElement(image.direction, 3, 2, 0), 0.0, 'direction (2, 0)')
  t.is(getMatrixElement(image.direction, 3, 2, 1), -1.0, 'direction (2, 1)')
  t.is(getMatrixElement(image.direction, 3, 2, 2), 0.0, 'direction (2, 2)')
  t.is(image.size[0], 256, 'size[0]')
  t.is(image.size[1], 256, 'size[1]')
  t.is(image.size[2], 3, 'size[2]')
  t.is(image.data.length, 3 * 65536, 'data.length')
  t.is(image.data[1000], 5, 'data[1000]')
  t.end()
}

export default function () {
  test('Test reading DICOM file series', t => {
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
      .then(function ({ image, webWorkerPool }) {
        webWorkerPool.terminateWorkers()
        verifyImage(t, image)
      })
  })

  test('Test reading DICOM file series, assume a single sorted series', t => {
    const fetchFiles = fileNames.map(function (file) {
      const path = testSeriesDirectory + file
      return axios.get(path, { responseType: 'blob' }).then(function (response) {
        const jsFile = new window.File([response.data], file)
        return jsFile
      })
    })

    return Promise.all(fetchFiles)
      .then(function (files) {
        const singleSortedSeries = true
        return readImageDICOMFileSeries(files, singleSortedSeries)
      })
      .then(function ({ image, webWorkerPool }) {
        webWorkerPool.terminateWorkers()
        verifyImage(t, image)
      })
  })

  test('Test reading DICOM array buffer series', async t => {
    const fetchFiles = fileNames.map(async function (file) {
      const path = testSeriesDirectory + file
      const response = await axios.get(path, { responseType: 'arraybuffer' })
      return response.data
    })

    const arrayBuffers = await Promise.all(fetchFiles)
    const { image, webWorkerPool } = await readImageDICOMArrayBufferSeries(arrayBuffers)
    webWorkerPool.terminateWorkers()
    verifyImage(t, image)
  })

  test('Test reading DICOM array buffer series given componentType, pixelType', async t => {
    const fetchFiles = fileNames.map(async function (file) {
      const path = testSeriesDirectory + file
      const response = await axios.get(path, { responseType: 'arraybuffer' })
      return response.data
    })

    const arrayBuffers = await Promise.all(fetchFiles)
    const componentType = IntTypes.Int32
    const pixelType = PixelTypes.Vector
    const { image, webWorkerPool } = await readImageDICOMArrayBufferSeries(arrayBuffers, { pixelType, componentType })
    webWorkerPool.terminateWorkers()
    verifyImage(t, image, componentType, pixelType)
  })

  test('Test reading DICOM array buffer series, assume a single sorted series', async t => {
    const fetchFiles = fileNames.map(async function (file) {
      const path = testSeriesDirectory + file
      const response = await axios.get(path, { responseType: 'arraybuffer' })
      return response.data
    })

    const arrayBuffers = await Promise.all(fetchFiles)
    const singleSortedSeries = true
    const { image, webWorkerPool } = await readImageDICOMArrayBufferSeries(arrayBuffers, singleSortedSeries)
    webWorkerPool.terminateWorkers()
    verifyImage(t, image)
  })

  test('Test reading DICOM array buffer series, assume a single sorted series, given componentType, pixelType', async t => {
    const fetchFiles = fileNames.map(async function (file) {
      const path = testSeriesDirectory + file
      const response = await axios.get(path, { responseType: 'arraybuffer' })
      return response.data
    })

    const arrayBuffers = await Promise.all(fetchFiles)
    const singleSortedSeries = true
    const componentType = IntTypes.Int32
    const pixelType = PixelTypes.Vector
    const { image, webWorkerPool } = await readImageDICOMArrayBufferSeries(arrayBuffers, { singleSortedSeries, componentType, pixelType })
    webWorkerPool.terminateWorkers()
    verifyImage(t, image, componentType, pixelType)
  })
}
