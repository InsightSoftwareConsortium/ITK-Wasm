import test from 'tape'

import { IntTypes, PixelTypes, getMatrixElement, readImageArrayBuffer, readImageBlob, readImageFile, readImageHTTP } from 'browser/index.js'

const cthead1SmallBase64DataURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAAAAABWESUoAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfhBQYVKw8AZTNIAAADdklEQVQ4y2WTa2wUVRiGp6W7O3POnLmc2VrstokJlrBIUBJigjfSICVCCAo/QKM/FFNRIESJQKAws3M7M2f20t3GthRKQQq0kkoXMIq9oFwCXkg0UpMakGLgR9EmJF4TNOvZhRBb31+TvM955/vO+T6Ou69pAgSwKCCAEPc/lYUhFEUkMgH2ESmbYocEEUmKLIQqBKmEgUlERQhAPhyJiDMXPFZZDmRGoP8Q5TwC4ciMpatfXE9zmT2NVRVIQiLi76cDUVRDT/m72zLUc/Srv+gNCi8jhCrupvMAQIWf1zJx58pRj7g7h/sduunhiIIkUAJ4AUBZ0LZev3TondmeS42TuaYms6kOapJUalYQAAKxt+j4qD3yxvMZ0z47NLi/ydhWA7GMinWyAH6G1Wwe/OdUz6dz33T35dPdIxdIYrPGK0qxTnYrobVtjm+3pNvPxGu9/dTRgw8/e89et0AKF1uFItS2u7ZP7fr4K3H19VbP94me/T6fXRifM6+a/QKC6N5+PWGYZhVeNn9pzvUoTVnt3/QEz81dUTONgwjis4UzvS2Z5JbY9JlPdxmEuFZzX9va0yu5WlXmRAlWd3Tmjg980vXBprJZbYPtza0dXw40ZleeP1ZbrWKOXXpsu7Grb3gnsY/27B46+e3ElVuF3w+sm7Pki2VAUxkAo1t0a7TL8YnVPZxy6KG9fX/+2qu/+9DARoAVBiDYaHjnfc/3nHOdicA1Em6WpnOdG/I6zwCA5PCzrn6uw6VO99gBnRBKGUyIMfz3BgmrHHta8cEdu04dN6wjPwy6FinaTNT8emKNzGrgBEmJLLf7T6Tf/60wpFP2oKToB/bNr+pVTWHjghQxZuTzW51C4aIZENdj8gMv+1f3I7iYwPEqrFu+z1/zzI3vHN/ziEd9P0haV39aXxXFRaBMRrCu9Vjj5o/S5C4QBCnjws+pJ9SoqpZmRlqyeNWlPa922El22PMCl5if38q9FGV+CeAaFuK4OZY5nLRoksnsPX19nL5do2GsREoAlCtr68lo4VoXNROWdXD8j7GUNV96AMPye5MtYgU/ujF/887tHy+PXLt9o9/asUipvDfWpc1QNFWKPfla8PHI5Ysnsua2l2dH1Un7WS6rKlamxx9f/MKKhkX1syoxmLqcUMVRDTNMlZGkilPsUrOsJ6wxRSel/wuAkzbenLRf4gAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNS0wNlQxNzoyNjozNC0wNDowMORO/MMAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDUtMDZUMTc6MjY6MzQtMDQ6MDCVE0R/AAAAAElFTkSuQmCC'
const byteString = window.atob(cthead1SmallBase64DataURI.split(',')[1])
const mimeString = cthead1SmallBase64DataURI.split(',')[0].split(':')[1].split(';')[0]
const intArray = new Uint8Array(byteString.length)
for (let ii = 0; ii < byteString.length; ++ii) {
  intArray[ii] = byteString.charCodeAt(ii)
}
const cthead1SmallBlob = new window.Blob([intArray], { type: mimeString })
const cthead1SmallFile = new window.File([cthead1SmallBlob], 'cthead1Small.png')

function verifyImage (t, image, componentType, pixelType) {
  t.is(image.imageType.dimension, 2, 'dimension')
  t.is(image.imageType.componentType, componentType)
  t.is(image.imageType.pixelType, pixelType)
  t.is(image.imageType.components, 1, 'components')
  t.is(image.origin[0], 0.0, 'origin[0]')
  t.is(image.origin[1], 0.0, 'origin[1]')
  t.is(image.spacing[0], 1.0, 'spacing[0]')
  t.is(image.spacing[1], 1.0, 'spacing[1]')
  t.is(getMatrixElement(image.direction, 2, 0, 0), 1.0, 'direction (0, 0)')
  t.is(getMatrixElement(image.direction, 2, 0, 1), 0.0, 'direction (0, 1)')
  t.is(getMatrixElement(image.direction, 2, 1, 0), 0.0, 'direction (1, 0)')
  t.is(getMatrixElement(image.direction, 2, 1, 1), 1.0, 'direction (1, 1)')
  t.is(image.size[0], 32, 'size[0]')
  t.is(image.size[1], 32, 'size[1]')
  t.is(image.data.length, 1024, 'data.length')
  t.is(image.data[512], 12, 'data[512]')
  t.end()
}

export default function () {
  test('readImageArrayBuffer reads an ArrayBuffer', async (t) => {
    const arrayBuffer = await cthead1SmallFile.arrayBuffer()
    const { image, webWorker } = await readImageArrayBuffer(null, arrayBuffer, 'cthead1Small.png')
    webWorker.terminate()
    const componentType = IntTypes.UInt8
    const pixelType = PixelTypes.Scalar
    verifyImage(t, image, componentType, pixelType)
  })

  test('readImageArrayBuffer casts to the specified componentType', async (t) => {
    const arrayBuffer = await cthead1SmallFile.arrayBuffer()
    const componentType = IntTypes.UInt16
    const { image, webWorker } = await readImageArrayBuffer(null, arrayBuffer, 'cthead1Small.png', { componentType })
    webWorker.terminate()
    const pixelType = PixelTypes.Scalar
    verifyImage(t, image, componentType, pixelType)
  })

  test('readImageArrayBuffer casts to the specified pixelType', async (t) => {
    const arrayBuffer = await cthead1SmallFile.arrayBuffer()
    const componentType = IntTypes.UInt16
    const pixelType = PixelTypes.Vector
    const { image, webWorker } = await readImageArrayBuffer(null, arrayBuffer, 'cthead1Small.png', { componentType, pixelType })
    webWorker.terminate()
    verifyImage(t, image, componentType, pixelType)
  })

  test('readImageBlob reads a Blob', async (t) => {
    const { image, webWorker } = await readImageBlob(null, cthead1SmallBlob, 'cthead1Small.png')
    webWorker.terminate()
    const componentType = IntTypes.UInt8
    const pixelType = PixelTypes.Scalar
    verifyImage(t, image, componentType, pixelType)
  })

  test('readImageBlob casts to the specified componentType', async (t) => {
    const componentType = IntTypes.UInt16
    const { image, webWorker } = await readImageBlob(null, cthead1SmallBlob, 'cthead1Small.png', { componentType })
    webWorker.terminate()
    const pixelType = PixelTypes.Scalar
    verifyImage(t, image, componentType, pixelType)
  })

  test('readImageBlob casts to the specified pixelType', async (t) => {
    const componentType = IntTypes.UInt16
    const pixelType = PixelTypes.Vector
    const { image, webWorker } = await readImageBlob(null, cthead1SmallBlob, 'cthead1Small.png', { componentType, pixelType })
    webWorker.terminate()
    verifyImage(t, image, componentType, pixelType)
  })

  test('readImageFile reads a File', async (t) => {
    const { image, webWorker } = await readImageFile(null, cthead1SmallFile)
    webWorker.terminate()
    const componentType = IntTypes.UInt8
    const pixelType = PixelTypes.Scalar
    verifyImage(t, image, componentType, pixelType)
  })

  test('readImageFile reads a File, given componentType, pixelType', async (t) => {
    const componentType = IntTypes.UInt16
    const pixelType = PixelTypes.Vector
    const { image, webWorker } = await readImageFile(null, cthead1SmallFile, { componentType, pixelType })
    webWorker.terminate()
    verifyImage(t, image, componentType, pixelType)
  })

  test('readImageFile re-uses a WebWorker', async (t) => {
    const { webWorker } = await readImageFile(null, cthead1SmallFile)
    const { image } = await readImageFile(webWorker, cthead1SmallFile)
    webWorker.terminate()
    const componentType = IntTypes.UInt8
    const pixelType = PixelTypes.Scalar
    verifyImage(t, image, componentType, pixelType)
  })

  test('readImageFile throws a catchable error for an invalid file', (t) => {
    const invalidArray = new Uint8Array([21, 4, 4, 4, 4, 9, 5, 0, 82, 42])
    const invalidBlob = new window.Blob([invalidArray])
    const invalidFile = new window.File([invalidBlob], 'invalid.file')
    return readImageFile(null, invalidFile).then(function ({ image, webWorker }) {
      webWorker.terminate()
      t.fail('should not have successfully read the image')
      t.end()
    }).catch(function (error) {
      t.pass(String(error))
      t.pass('thrown an error that was caught')
      t.end()
    })
  })

  test('readImageHTTP reads itk-wasm Image from a URL', async (t) => {
    const testURL = 'base/build-emscripten/ExternalData/test/Input/cthead1.iwi'
    const image = await readImageHTTP(testURL)
    t.is(image.imageType.dimension, 2, 'dimension')
    t.is(image.imageType.componentType, IntTypes.UInt8, 'componentType')
    t.is(image.imageType.pixelType, PixelTypes.RGB, 'pixelType')
    t.is(image.imageType.components, 3, 'components')
    t.is(image.origin[0], 0.0, 'origin[0]')
    t.is(image.origin[1], 0.0, 'origin[1]')
    t.is(image.spacing[0], 1.0, 'spacing[0]')
    t.is(image.spacing[1], 1.0, 'spacing[1]')
    t.is(getMatrixElement(image.direction, 2, 0, 0), 1.0, 'direction (0, 0)')
    t.is(getMatrixElement(image.direction, 2, 0, 1), 0.0, 'direction (0, 1)')
    t.is(getMatrixElement(image.direction, 2, 1, 0), 0.0, 'direction (1, 0)')
    t.is(getMatrixElement(image.direction, 2, 1, 1), 1.0, 'direction (1, 1)')
    t.is(image.size[0], 256, 'size[0]')
    t.is(image.size[1], 256, 'size[1]')
    t.is(image.data.length, 196608, 'data.length')
    t.is(image.data[512], 10, 'data[512]')
    t.end()
  })
}
