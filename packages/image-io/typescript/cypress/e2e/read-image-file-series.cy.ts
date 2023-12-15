import { demoServer } from './common.ts'

function verifyImage (image) {
  cy.expect(image.imageType.dimension).to.equal(3)
  cy.expect(image.imageType.componentType).to.equal('uint16')
  cy.expect(image.imageType.pixelType).to.equal('Scalar')
  cy.expect(image.imageType.components).to.equal(1)
  cy.expect(image.origin[0]).to.equal(0.0)
  cy.expect(image.origin[1]).to.equal(0.0)
  cy.expect(image.origin[2]).to.equal(2.0)
  cy.expect(image.spacing[0]).to.equal(0.85935)
  cy.expect(image.spacing[1]).to.equal(0.85935)
  cy.expect(image.spacing[2]).to.equal(3.0)
  cy.expect(image.size[0]).to.equal(256)
  cy.expect(image.size[1]).to.equal(256)
  cy.expect(image.size[2]).to.equal(3)
  cy.expect(image.data.length).to.equal(3 * 65536)
  cy.expect(image.data[1000]).to.equal(0)
}

const zSpacing = 3.0
const zOrigin = 2.0
const testImageFiles = [
  'mri3D_01.png',
  'mri3D_02.png',
  'mri3D_03.png',
]

describe('meta-image', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/PNGSeries/'

    cy.window().then((win) => {
      win.testImageFiles = {}
    })
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
      cy.window().then((win) => {
        win.testImageFiles[fileName] = this[fileName]
      })
    })
  })

  it('Reads a sorted PNG file series', function () {
    cy.window().then(async (win) => {
      const files = testImageFiles.map((fileName) => {
        return { data: new Uint8Array(win.testImageFiles[fileName]), path: fileName }
      })
      const sortedSeries = true

      const { image, webWorkerPool } = await win.imageIo.readImageFileSeries(files, { zSpacing, zOrigin, sortedSeries })
      webWorkerPool.terminateWorkers()
      verifyImage(image)
    })
  })

  it('Reads sorted PNG file series, specify componentType, pixelType', function () {
    cy.window().then(async (win) => {
      const files = testImageFiles.map((fileName) => {
        return { data: new Uint8Array(win.testImageFiles[fileName]), path: fileName }
      })
      const sortedSeries = true
      const componentType = win.itk.IntTypes.Int32
      const pixelType = win.itk.PixelTypes.Vector

      const { image, webWorkerPool } = await win.imageIo.readImageFileSeries(files, { zSpacing, zOrigin, sortedSeries, componentType, pixelType })
      webWorkerPool.terminateWorkers()
      cy.expect(image.imageType.componentType).to.equal('int32')
      cy.expect(image.imageType.pixelType).to.equal('Vector')
    })
  })

  it('Reads an unsorted PNG file series', function () {
    cy.window().then(async (win) => {
      const files = testImageFiles.map((fileName) => {
        return { data: new Uint8Array(win.testImageFiles[fileName]), path: fileName }
      })
      files.reverse()

      const { image, webWorkerPool } = await win.imageIo.readImageFileSeries(files, { zSpacing, zOrigin })
      webWorkerPool.terminateWorkers()
      verifyImage(image)
    })
  })

  it('Reads an unsorted PNG file series, specifying componentType, pixelType', function () {
    cy.window().then(async (win) => {
      const files = testImageFiles.map((fileName) => {
        return { data: new Uint8Array(win.testImageFiles[fileName]), path: fileName }
      })
      files.reverse()
      const componentType = win.itk.IntTypes.Int32
      const pixelType = win.itk.PixelTypes.Vector

      const { image, webWorkerPool } = await win.imageIo.readImageFileSeries(files, { zSpacing, zOrigin, componentType, pixelType })
      webWorkerPool.terminateWorkers()
      cy.expect(image.imageType.componentType).to.equal('int32')
      cy.expect(image.imageType.pixelType).to.equal('Vector')
    })
  })
})