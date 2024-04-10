import { demoServer } from './common.ts'

describe('mgh', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    const testImageFiles = [
      'T1.mgz',
    ]
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
    })
  })

  it('Reads a MGH image', function () {
    cy.get('sl-tab[panel="mghReadImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['T1.mgz']), fileName: 'image_color.mgh' }
    cy.get('#mghReadImageInputs input[name="serialized-image-file"]').selectFile([testFile,], { force: true })
    cy.get('#mghReadImage-serialized-image-details').should('contain', '31,139')

    cy.get('#mghReadImageInputs sl-button[name="run"]').click()

    cy.get('#mghReadImage-could-read-details').should('contain', 'true')
    cy.get('#mghReadImage-image-details').contains('imageType')
  })
})
