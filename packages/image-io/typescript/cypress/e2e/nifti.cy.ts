import { demoServer } from './common.ts'

describe('nifti', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    const testImageFiles = [
      'r16slice.nii.gz',
      'r16slice.iwi.cbor',
    ]
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
    })
  })

  it('Reads a Nifti image', function () {
    cy.get('sl-tab[panel="niftiReadImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['r16slice.nii.gz']), fileName: 'r16slice.nii.gz' }
    cy.get('#niftiReadImageInputs input[name="serialized-image-file"]').selectFile([testFile,], { force: true })
    cy.get('#niftiReadImage-serialized-image-details').should('contain', '31,139')

    cy.get('#niftiReadImageInputs sl-button[name="run"]').click()

    cy.get('#niftiReadImage-could-read-details').should('contain', 'true')
    cy.get('#niftiReadImage-image-details').should('contain', 'imageType')
  })

  it('Writes a Nifti image', function () {
    cy.get('sl-tab[panel="niftiWriteImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['r16slice.iwi.cbor']), fileName: 'image_color.iwi.cbor' }
    cy.get('#niftiWriteImageInputs input[name="image-file"]').selectFile([testFile,], { force: true })
    cy.get('#niftiWriteImage-image-details').should('contain', 'imageType')
    cy.get('#niftiWriteImageInputs sl-input[name="serialized-image"]').find('input', { includeShadowDom: true }).type('r16slice.nii.gz', { force: true })

    cy.get('#niftiWriteImageInputs sl-button[name="run"]').click()

    cy.get('#niftiWriteImage-could-write-details').should('contain', 'true')
    cy.get('#niftiWriteImage-serialized-image-details').should('contain', '31,139')
  })
})
