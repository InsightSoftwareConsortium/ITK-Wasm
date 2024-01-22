import { demoServer } from './common.ts'

describe('downsample', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    const testImageFiles = [
      'cthead1.png'
    ]
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
    })
  })

  it('Downsamples an image', function () {
    cy.get('sl-tab[panel="downsample-panel"]').click()

    const testFile = { contents: new Uint8Array(this['cthead1.png']), fileName: 'cthead1.png' }
    cy.get('#downsampleInputs input[name="input-file"]').selectFile([testFile,], { force: true })
    cy.get('#downsample-input-details').should('contain', 'imageType')
    cy.get('#downsampleInputs sl-input[name="shrink-factors"]').find('input', { includeShadowDom: true }).clear().type('[2, 2]', { force: true })

    cy.get('#downsampleInputs sl-button[name="run"]').click()

    cy.get('#downsample-downsampled-details').should('contain', 'imageType')
  })
})
