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

describe('read-image', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    const testImageFiles = [
      'cthead1.png'
    ]
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
    })
  })

  it('Reads an image File in the demo', function () {
    cy.get('sl-tab[panel="readImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['cthead1.png']), fileName: 'cthead1.png' }
    cy.get('#readImageInputs input[name="serialized-image-file"]').selectFile([testFile,], { force: true })
    cy.get('#readImage-serialized-image-details').should('contain', '137,80')

    cy.get('#readImageInputs sl-button[name="run"]').click()

    cy.get('#readImage-image-details').should('contain', 'imageType')
  })

  it('Reads an image BinaryFile', function () {
    cy.window().then(async (win) => {
      const arrayBuffer = await cthead1SmallBlob.arrayBuffer()
      const { image, webWorker } = await win.imageIo.readImage({ data: new Uint8Array(arrayBuffer), path: 'cthead1Small.png' })
      webWorker.terminate()
      const componentType = IntTypes.UInt8
      const pixelType = PixelTypes.Scalar
      verifyImage(image, componentType, pixelType)
    })
  })

  it('Reads an image cast to the specified pixelType and componentType', function () {
    cy.window().then(async (win) => {
      const arrayBuffer = await cthead1SmallBlob.arrayBuffer()
      const componentType = IntTypes.UInt16
      const pixelType = PixelTypes.Vector
      const { image, webWorker } = await win.imageIo.readImage({ data: new Uint8Array(arrayBuffer), path: 'cthead1Small.png' }, { pixelType, componentType})
      webWorker.terminate()
      verifyImage(image, componentType, pixelType)
    })
  })

  it('Reads an image File', function () {
    cy.window().then(async (win) => {
      const cthead1SmallFile = new win.File([cthead1SmallBlob], 'cthead1Small.png')
      const { image, webWorker } = await win.imageIo.readImage(cthead1SmallFile)
      webWorker.terminate()
      const componentType = IntTypes.UInt8
      const pixelType = PixelTypes.Scalar
      verifyImage(image, componentType, pixelType)
    })
  })

  it('Reads re-uses a WebWorker', function () {
    cy.window().then(async (win) => {
      const cthead1SmallFile = new win.File([cthead1SmallBlob], 'cthead1Small.png')
      const { webWorker } = await win.imageIo.readImage(cthead1SmallFile)
      const { image } = await win.imageIo.readImage(cthead1SmallFile, { webWorker })
      webWorker.terminate()
      const componentType = IntTypes.UInt8
      const pixelType = PixelTypes.Scalar
      verifyImage(image, componentType, pixelType)
    })
  })

  it('Throws a catchable error for an invalid file', { defaultCommandTimeout: 120000 }, function () {
    cy.window().then(async (win) => {
      const invalidArray = new Uint8Array([21, 4, 4, 4, 4, 9, 5, 0, 82, 42])
      const invalidBlob = new win.Blob([invalidArray])
      const invalidFile = new win.File([invalidBlob], 'invalid.file')
      try {
        const { webWorker, image } = await win.imageIo.readImage(invalidFile)
        webWorker.terminate()
      } catch (error) {
        cy.expect(error.message).to.equal('Could not find IO for: invalid.file')
      }
    })
  })
})
