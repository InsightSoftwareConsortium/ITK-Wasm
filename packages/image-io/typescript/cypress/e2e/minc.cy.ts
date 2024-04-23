import { demoServer } from './common.ts'

describe('minc', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    const testImageFiles = [
      't1_z+_short_cor.mnc',
    ]
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
    })
  })

  it('Reads a MINC image', function () {
    cy.get('sl-tab[panel="mincReadImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['t1_z+_short_cor.mnc']), fileName: 't1_z+_short_cor.mnc' }
    cy.get('#mincReadImageInputs input[name="serialized-image-file"]').selectFile([testFile,], { force: true })
    cy.get('#mincReadImage-serialized-image-details').should('contain', '137,72')

    cy.get('#mincReadImageInputs sl-button[name="run"]').click()

    cy.get('#mincReadImage-could-read-details').should('contain', 'true')
    cy.get('#mincReadImage-image-details').contains('imageType')
  })
})
