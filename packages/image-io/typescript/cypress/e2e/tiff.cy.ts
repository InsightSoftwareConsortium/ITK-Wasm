import { demoServer } from './common.ts'

describe('tiff', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    const testImageFiles = [
      'ShortTestImage.tiff',
      'ShortTestImage.iwi.cbor',
    ]
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
    })
  })

  it('Reads a TIFF image', function () {
    cy.get('sl-tab[panel="tiffReadImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['ShortTestImage.tiff']), fileName: 'ShortTestImage.tiff' }
    cy.get('#tiffReadImageInputs input[name="serialized-image-file"]').selectFile([testFile,], { force: true })
    cy.get('#tiffReadImage-serialized-image-details').should('contain', '73,73')

    cy.get('#tiffReadImageInputs sl-button[name="run"]').click()

    cy.get('#tiffReadImage-could-read-details').should('contain', 'true')
    cy.get('#tiffReadImage-image-details').contains('imageType')
  })

  it('Writes a TIFF image', function () {
    cy.get('sl-tab[panel="tiffWriteImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['ShortTestImage.iwi.cbor']), fileName: 'ShortTestImage.iwi.cbor' }
    cy.get('#tiffWriteImageInputs input[name="image-file"]').selectFile([testFile,], { force: true })
    cy.get('#tiffWriteImage-image-details').contains('imageType')
    cy.get('#tiffWriteImageInputs sl-input[name="serialized-image"]').find('input', { includeShadowDom: true }).type('ShortTestImage.tiff', { force: true })

    cy.get('#tiffWriteImageInputs sl-button[name="run"]').click()

    cy.get('#tiffWriteImage-could-write-details').should('contain', 'true')
    cy.get('#tiffWriteImage-serialized-image-details').should('contain', '73,73')
  })
})
