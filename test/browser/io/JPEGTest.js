import test from 'tape'
import axios from 'axios'

import { IntTypes, PixelTypes, getMatrixElement, readImageFile } from 'browser/index.js'

export default function () {

  // Todo: Fix setjmp lost
  // const verifyImage = (t, image) => {
  // t.is(image.imageType.dimension, 2, 'dimension')
  // t.is(image.imageType.componentType, IntTypes.UInt8, 'componentType')
  // t.is(image.imageType.pixelType, PixelTypes.RGB, 'pixelType')
  // t.is(image.imageType.components, 3, 'components')
  // t.is(image.origin[0], 0.0, 'origin[0]')
  // t.is(image.origin[1], 0.0, 'origin[1]')
  // t.is(image.spacing[0], 0.35277777777777775, 'spacing[0]')
  // t.is(image.spacing[1], 0.35277777777777775, 'spacing[1]')
  // t.is(getMatrixElement(image.direction, 0, 0), 1.0, 'direction (0, 0)')
  // t.is(getMatrixElement(image.direction, 0, 1), 0.0, 'direction (0, 1)')
  // t.is(getMatrixElement(image.direction, 1, 0), 0.0, 'direction (1, 0)')
  // t.is(getMatrixElement(image.direction, 1, 1), 1.0, 'direction (1, 1)')
  // t.is(image.size[0], 160, 'size[0]')
  // t.is(image.size[1], 179, 'size[1]')
  // t.is(image.data.length, 85920, 'data.length')
  // t.is(image.data[1000], 255, 'data[1000]')
  // t.end()
  // }
  //
  // test('Test reading a JPEG file', async (t) => {
  // const fileName = 'apple.jpg'
  // const testFilePath = 'base/build/ExternalData/test/Input/' + fileName
  // const response = await axios.get(testFilePath, { responseType: 'blob' })
  // const jsFile = await new window.File([response.data], fileName)
  // const { image, webWorker } = await readImageFile(null, jsFile)
  // webWorker.terminate()
  // verifyImage(t, image)
  // })

}
