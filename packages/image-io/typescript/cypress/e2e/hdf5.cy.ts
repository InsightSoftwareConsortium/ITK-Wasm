import { demoServer } from './common.ts'

describe('hdf5', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    const testImageFiles = [
      'ITKImage.hdf5',
    ]
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
    })
  })

  it('Reads a HDF5 image', function () {
    cy.get('sl-tab[panel="hdf5ReadImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['ITKImage.hdf5']), fileName: 'ITKImage.hdf5' }
    cy.get('#hdf5ReadImageInputs input[name="serialized-image-file"]').selectFile([testFile,], { force: true })
    cy.get('#hdf5ReadImage-serialized-image-details').should('contain', '137,72')

    cy.get('#hdf5ReadImageInputs sl-button[name="run"]').click()

    cy.get('#hdf5ReadImage-could-read-details').should('contain', 'true')
    cy.get('#hdf5ReadImage-image-details').should('contain', 'imageType')
  })
})
