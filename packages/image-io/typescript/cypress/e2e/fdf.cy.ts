import { demoServer } from './common.ts'

describe('fdf', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    const testImageFiles = [
      'test.fdf',
    ]
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
    })
  })

  it('Reads a FDF image', function () {
    cy.get('sl-tab[panel="fdfReadImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['test.fdf']), fileName: 'test.fdf' }
    cy.get('#fdfReadImageInputs input[name="serialized-image-file"]').selectFile([testFile,], { force: true })
    cy.get('#fdfReadImage-serialized-image-details').should('contain', '35,33')

    cy.get('#fdfReadImageInputs sl-button[name="run"]').click()

    cy.get('#fdfReadImage-could-read-details').should('contain', 'true')
    cy.get('#fdfReadImage-image-details').contains('imageType')
  })
})
