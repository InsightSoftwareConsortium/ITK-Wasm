import { demoServer } from './common.ts'

describe('bmp', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    const testImageFiles = [
      'image_color.bmp',
      'image_color.iwi.cbor',
    ]
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
    })
  })

  it('Reads a BMP image', function () {
    cy.get('sl-tab[panel="bmpReadImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['image_color.bmp']), fileName: 'image_color.bmp' }
    cy.get('#bmpReadImageInputs input[name="serialized-image-file"]').selectFile([testFile,], { force: true })
    cy.get('#bmpReadImage-serialized-image-details').should('contain', '0,3')

    cy.get('#bmpReadImageInputs sl-button[name="run"]').click()

    cy.get('#bmpReadImage-could-read-details').should('contain', 'true')
    cy.get('#bmpReadImage-image-details').contains('imageType')
  })

  it('Writes a BioRad image', function () {
    cy.get('sl-tab[panel="bmpWriteImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['image_color.iwi.cbor']), fileName: 'image_color.iwi.cbor' }
    cy.get('#bmpWriteImageInputs input[name="image-file"]').selectFile([testFile,], { force: true })
    cy.get('#bmpWriteImage-image-details').contains('imageType')
    cy.get('#bmpWriteImageInputs sl-input[name="serialized-image"]').find('input', { includeShadowDom: true }).type('image_color.bmp', { force: true })

    cy.get('#bmpWriteImageInputs sl-button[name="run"]').click()

    cy.get('#bmpWriteImage-could-write-details').should('contain', 'true')
    cy.get('#bmpWriteImage-serialized-image-details').should('contain', '0,3')
  })
})
