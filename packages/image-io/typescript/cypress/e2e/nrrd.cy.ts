import { demoServer } from './common.ts'

describe('nrrd', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    const testImageFiles = [
      'vol-raw-little.nrrd',
      'vol-raw-little.iwi.cbor',
    ]
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
    })
  })

  it('Reads a nrrd image', function () {
    cy.get('sl-tab[panel="nrrdReadImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['vol-raw-little.nrrd']), fileName: 'vol-raw-little.nrrd' }
    cy.get('#nrrdReadImageInputs input[name="serialized-image-file"]').selectFile([testFile,], { force: true })
    cy.get('#nrrdReadImage-serialized-image-details').should('contain', '78,82')

    cy.get('#nrrdReadImageInputs sl-button[name="run"]').click()

    cy.get('#nrrdReadImage-could-read-details').should('contain', 'true')
    cy.get('#nrrdReadImage-image-details').contains('imageType')
  })

  it('Writes a BioRad image', function () {
    cy.get('sl-tab[panel="nrrdWriteImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['vol-raw-little.iwi.cbor']), fileName: 'vol-raw-little.iwi.cbor' }
    cy.get('#nrrdWriteImageInputs input[name="image-file"]').selectFile([testFile,], { force: true })
    cy.get('#nrrdWriteImage-image-details').contains('imageType')
    cy.get('#nrrdWriteImageInputs sl-input[name="serialized-image"]').find('input', { includeShadowDom: true }).type('vol-raw-little.nrrd', { force: true })

    cy.get('#nrrdWriteImageInputs sl-button[name="run"]').click()

    cy.get('#nrrdWriteImage-could-write-details').should('contain', 'true')
    cy.get('#nrrdWriteImage-serialized-image-details').should('contain', '78,82')
  })
})
