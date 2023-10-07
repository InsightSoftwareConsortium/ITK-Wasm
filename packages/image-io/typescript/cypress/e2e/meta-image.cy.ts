import { demoServer } from './common.ts'

describe('meta-image', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    const testImageFiles = [
      'brainweb165a10f17.mha',
      'brainweb165a10f17.iwi.cbor',
    ]
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
    })
  })

  it('Reads a MetaImage image', function () {
    cy.get('sl-tab[panel="metaReadImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['brainweb165a10f17.mha']), fileName: 'brainweb165a10f17.mha' }
    cy.get('#metaReadImageInputs input[name="serialized-image-file"]').selectFile([testFile,], { force: true })
    cy.get('#metaReadImage-serialized-image-details').should('contain', '79,98')

    cy.get('#metaReadImageInputs sl-button[name="run"]').click()

    cy.get('#metaReadImage-could-read-details').should('contain', 'true')
    cy.get('#metaReadImage-image-details').should('contain', 'imageType')
  })

  it('Writes a MetaImage image', function () {
    cy.get('sl-tab[panel="metaWriteImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['brainweb165a10f17.iwi.cbor']), fileName: 'brainweb165a10f17.iwi.cbor' }
    cy.get('#metaWriteImageInputs input[name="image-file"]').selectFile([testFile,], { force: true })
    cy.get('#metaWriteImage-image-details').should('contain', 'imageType')
    cy.get('#metaWriteImageInputs sl-input[name="serialized-image"]').find('input', { includeShadowDom: true }).type('brainweb165a10f17.mha', { force: true })

    cy.get('#metaWriteImageInputs sl-button[name="run"]').click()

    cy.get('#metaWriteImage-could-write-details').should('contain', 'true')
    cy.get('#metaWriteImage-serialized-image-details').should('contain', '79,98')
  })
})
