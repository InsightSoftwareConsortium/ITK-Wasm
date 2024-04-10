import { demoServer } from './common.ts'

describe('bio-rad', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    const testImageFiles = [
      'biorad.pic',
      'biorad.iwi.cbor',
    ]
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
    })
  })

  it('Reads a BioRad image', function () {
    cy.get('sl-tab[panel="bioRadReadImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['biorad.pic']), fileName: 'biorad.pic' }
    cy.get('#bioRadReadImageInputs input[name="serialized-image-file"]').selectFile([testFile,], { force: true })
    cy.get('#bioRadReadImage-serialized-image-details').should('contain', '0,3')

    cy.get('#bioRadReadImageInputs sl-button[name="run"]').click()

    cy.get('#bioRadReadImage-could-read-details').should('contain', 'true')
    cy.get('#bioRadReadImage-image-details').contains('imageType')
  })

  it('Writes a BioRad image', function () {
    cy.get('sl-tab[panel="bioRadWriteImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['biorad.iwi.cbor']), fileName: 'biorad.iwi.cbor' }
    cy.get('#bioRadWriteImageInputs input[name="image-file"]').selectFile([testFile,], { force: true })
    cy.get('#bioRadWriteImage-image-details').contains('imageType')
    cy.get('#bioRadWriteImageInputs sl-input[name="serialized-image"]').find('input', { includeShadowDom: true }).type('biorad.pic', { force: true })

    cy.get('#bioRadWriteImageInputs sl-button[name="run"]').click()

    cy.get('#bioRadWriteImage-could-write-details').should('contain', 'true')
    cy.get('#bioRadWriteImage-serialized-image-details').should('contain', '0,3')
  })
})
