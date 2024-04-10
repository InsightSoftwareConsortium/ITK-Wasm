import { demoServer } from './common.ts'

describe('png', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    const testImageFiles = [
      'cthead1.png',
      'cthead1.iwi.cbor',
    ]
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
    })
  })

  it('Reads a PNG image', function () {
    cy.get('sl-tab[panel="pngReadImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['cthead1.png']), fileName: 'cthead1.png' }
    cy.get('#pngReadImageInputs input[name="serialized-image-file"]').selectFile([testFile,], { force: true })
    cy.get('#pngReadImage-serialized-image-details').should('contain', '137,80')

    cy.get('#pngReadImageInputs sl-button[name="run"]').click()

    cy.get('#pngReadImage-could-read-details').should('contain', 'true')
    cy.get('#pngReadImage-image-details').contains('imageType')
  })

  it('Writes a PNG image', function () {
    cy.get('sl-tab[panel="pngWriteImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['cthead1.iwi.cbor']), fileName: 'cthead1.iwi.cbor' }
    cy.get('#pngWriteImageInputs input[name="image-file"]').selectFile([testFile,], { force: true })
    cy.get('#pngWriteImage-image-details').contains('imageType')
    cy.get('#pngWriteImageInputs sl-input[name="serialized-image"]').find('input', { includeShadowDom: true }).type('cthead1.png', { force: true })

    cy.get('#pngWriteImageInputs sl-button[name="run"]').click()

    cy.get('#pngWriteImage-could-write-details').should('contain', 'true')
    cy.get('#pngWriteImage-serialized-image-details').should('contain', '137,80')
  })
})
