import { demoServer } from './common.ts'

describe('mrc', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    const testImageFiles = [
      'tilt_series_little.mrc',
    ]
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
    })
  })

  it('Reads a MRC image', function () {
    cy.get('sl-tab[panel="mrcReadImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['tilt_series_little.mrc']), fileName: 'tilt_series_little.mrc' }
    cy.get('#mrcReadImageInputs input[name="serialized-image-file"]').selectFile([testFile,], { force: true })
    cy.get('#mrcReadImage-serialized-image-details').should('contain', '34,0')

    cy.get('#mrcReadImageInputs sl-button[name="run"]').click()

    cy.get('#mrcReadImage-could-read-details').should('contain', 'true')
    cy.get('#mrcReadImage-image-details').contains('imageType')
  })
})
