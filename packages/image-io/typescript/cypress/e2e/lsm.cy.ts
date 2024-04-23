import { demoServer } from './common.ts'

describe('lsm', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    const testImageFiles = [
      'cthead1.lsm',
    ]
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
    })
  })

  it('Reads a lsm image', function () {
    cy.get('sl-tab[panel="lsmReadImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['cthead1.lsm']), fileName: 'cthead1.lsm' }
    cy.get('#lsmReadImageInputs input[name="serialized-image-file"]').selectFile([testFile,], { force: true })
    cy.get('#lsmReadImage-serialized-image-details').should('contain', '73,73')

    cy.get('#lsmReadImageInputs sl-button[name="run"]').click()

    cy.get('#lsmReadImage-could-read-details').should('contain', 'true')
    cy.get('#lsmReadImage-image-details').contains('imageType')
  })
})
