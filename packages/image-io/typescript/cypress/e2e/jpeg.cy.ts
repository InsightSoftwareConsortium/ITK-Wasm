import { demoServer } from './common.ts'

describe('jpeg', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    const testImageFiles = [
      'apple.jpg',
    ]
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
    })
  })

  it('Reads a JPEG image', function () {
    cy.get('sl-tab[panel="jpegReadImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['apple.jpg']), fileName: 'apple.jpg' }
    cy.get('#jpegReadImageInputs input[name="serialized-image-file"]').selectFile([testFile,], { force: true })
    cy.get('#jpegReadImage-serialized-image-details').should('contain', '255,216')

    cy.get('#jpegReadImageInputs sl-button[name="run"]').click()

    cy.get('#jpegReadImage-could-read-details').should('contain', 'true')
    cy.get('#jpegReadImage-image-details').should('contain', 'imageType')
  })
})
