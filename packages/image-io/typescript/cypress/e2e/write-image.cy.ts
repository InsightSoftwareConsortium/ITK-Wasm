import { demoServer } from './common.ts'

import { IntTypes, PixelTypes } from 'itk-wasm'

const cthead1SmallBase64DataURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAAAAABWESUoAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfhBQYVKw8AZTNIAAADdklEQVQ4y2WTa2wUVRiGp6W7O3POnLmc2VrstokJlrBIUBJigjfSICVCCAo/QKM/FFNRIESJQKAws3M7M2f20t3GthRKQQq0kkoXMIq9oFwCXkg0UpMakGLgR9EmJF4TNOvZhRBb31+TvM955/vO+T6Ou69pAgSwKCCAEPc/lYUhFEUkMgH2ESmbYocEEUmKLIQqBKmEgUlERQhAPhyJiDMXPFZZDmRGoP8Q5TwC4ciMpatfXE9zmT2NVRVIQiLi76cDUVRDT/m72zLUc/Srv+gNCi8jhCrupvMAQIWf1zJx58pRj7g7h/sduunhiIIkUAJ4AUBZ0LZev3TondmeS42TuaYms6kOapJUalYQAAKxt+j4qD3yxvMZ0z47NLi/ydhWA7GMinWyAH6G1Wwe/OdUz6dz33T35dPdIxdIYrPGK0qxTnYrobVtjm+3pNvPxGu9/dTRgw8/e89et0AKF1uFItS2u7ZP7fr4K3H19VbP94me/T6fXRifM6+a/QKC6N5+PWGYZhVeNn9pzvUoTVnt3/QEz81dUTONgwjis4UzvS2Z5JbY9JlPdxmEuFZzX9va0yu5WlXmRAlWd3Tmjg980vXBprJZbYPtza0dXw40ZleeP1ZbrWKOXXpsu7Grb3gnsY/27B46+e3ElVuF3w+sm7Pki2VAUxkAo1t0a7TL8YnVPZxy6KG9fX/+2qu/+9DARoAVBiDYaHjnfc/3nHOdicA1Em6WpnOdG/I6zwCA5PCzrn6uw6VO99gBnRBKGUyIMfz3BgmrHHta8cEdu04dN6wjPwy6FinaTNT8emKNzGrgBEmJLLf7T6Tf/60wpFP2oKToB/bNr+pVTWHjghQxZuTzW51C4aIZENdj8gMv+1f3I7iYwPEqrFu+z1/zzI3vHN/ziEd9P0haV39aXxXFRaBMRrCu9Vjj5o/S5C4QBCnjws+pJ9SoqpZmRlqyeNWlPa922El22PMCl5if38q9FGV+CeAaFuK4OZY5nLRoksnsPX19nL5do2GsREoAlCtr68lo4VoXNROWdXD8j7GUNV96AMPye5MtYgU/ujF/887tHy+PXLt9o9/asUipvDfWpc1QNFWKPfla8PHI5Ysnsua2l2dH1Un7WS6rKlamxx9f/MKKhkX1syoxmLqcUMVRDTNMlZGkilPsUrOsJ6wxRSel/wuAkzbenLRf4gAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNS0wNlQxNzoyNjozNC0wNDowMORO/MMAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDUtMDZUMTc6MjY6MzQtMDQ6MDCVE0R/AAAAAElFTkSuQmCC'
const byteString = window.atob(cthead1SmallBase64DataURI.split(',')[1])
const mimeString = cthead1SmallBase64DataURI.split(',')[0].split(':')[1].split(';')[0]
const intArray = new Uint8Array(byteString.length)
for (let ii = 0; ii < byteString.length; ++ii) {
  intArray[ii] = byteString.charCodeAt(ii)
}
const cthead1SmallBlob = new window.Blob([intArray], { type: mimeString })

function verifyImage (image, componentType, pixelType) {
  cy.expect(image.imageType.dimension).to.equal(2)
  cy.expect(image.imageType.componentType).to.equal(componentType)
  cy.expect(image.imageType.pixelType).to.equal(pixelType)
  cy.expect(image.imageType.components).to.equal(1)
  cy.expect(image.origin[0]).to.equal(0.0)
  cy.expect(image.origin[1]).to.equal(0.0)
  cy.expect(image.spacing[0]).to.equal(1.0)
  cy.expect(image.spacing[1]).to.equal(1.0)
  cy.expect(image.size[0]).to.equal(32)
  cy.expect(image.size[1]).to.equal(32)
  cy.expect(image.data.length).to.equal(1024)
  cy.expect(image.data[512]).to.equal(12)
}

describe('write-image', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    const testImageFiles = [
      'cthead1.iwi.cbor'
    ]
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
    })
  })

  it('Writes an image in the demo', function () {
    cy.get('sl-tab[panel="writeImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['cthead1.iwi.cbor']), fileName: 'cthead1.iwi.cbor' }
    cy.get('#writeImageInputs input[name="image-file"]').selectFile([testFile,], { force: true })
    cy.get('#writeImage-image-details').should('contain', 'imageType')
    cy.get('#writeImageInputs sl-input[name="serialized-image"]').find('input', { includeShadowDom: true }).type('cthead1.png', { force: true })

    cy.get('#writeImageInputs sl-button[name="run"]').click()

    cy.get('#writeImage-serialized-image-details').should('contain', '0,3')
  })

  it('Writes an image to an ArrayBuffer', function () {
    cy.window().then(async (win) => {
      const arrayBuffer = await cthead1SmallBlob.arrayBuffer()
      const { image, webWorker } = await win.imageIo.readImage({ data: new Uint8Array(arrayBuffer), path: 'cthead1Small.png' })
      const { serializedImage } = await win.imageIo.writeImage(image, 'cthead1.mha', { webWorker })
      const { image: imageBack } = await win.imageIo.readImage(serializedImage, { webWorker })
      webWorker.terminate()
      const componentType = IntTypes.UInt8
      const pixelType = PixelTypes.Scalar
      verifyImage(imageBack, componentType, pixelType)
    })
  })

  it('Writes an image to an ArrayBuffer, given componentType, pixelType', function () {
    cy.window().then(async (win) => {
      const componentType = IntTypes.UInt16
      const pixelType = PixelTypes.Vector
      const arrayBuffer = await cthead1SmallBlob.arrayBuffer()
      const { image, webWorker } = await win.imageIo.readImage({ data: new Uint8Array(arrayBuffer), path: 'cthead1Small.png' })
      const { serializedImage } = await win.imageIo.writeImage(image, 'cthead1.mha', { pixelType, componentType, webWorker })
      // Reading back, the pixelType is always Scalar (reader behavior). Is this a bug?
      const { image: imageBack } = await win.imageIo.readImage(serializedImage, { pixelType, webWorker })
      webWorker.terminate()
      verifyImage(imageBack, componentType, pixelType)
    })
  })

  it('Writes an image to an ArrayBuffer, uses compression', function () {
    cy.window().then(async (win) => {
      const arrayBuffer = await cthead1SmallBlob.arrayBuffer()
      const { image, webWorker } = await win.imageIo.readImage({ data: new Uint8Array(arrayBuffer), path: 'cthead1Small.png' })
      const options = { useCompression: false, webWorker }
      const { serializedImage } = await win.imageIo.writeImage(image, 'cthead1.mha', options)
      const { image: imageBack } = await win.imageIo.readImage(serializedImage, { webWorker })
      webWorker.terminate()
      const componentType = IntTypes.UInt8
      const pixelType = PixelTypes.Scalar
      verifyImage(imageBack, componentType, pixelType)
    })
  })
})
