import { demoServer } from './common.ts'

describe('vtk', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    const testImageFiles = [
      'ironProt.vtk',
      'ironProt.iwi.cbor',
    ]
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
    })
  })

  it('Reads a VTK image', function () {
    cy.get('sl-tab[panel="vtkReadImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['ironProt.vtk']), fileName: 'ironProt.vtk' }
    cy.get('#vtkReadImageInputs input[name="serialized-image-file"]').selectFile([testFile,], { force: true })
    cy.get('#vtkReadImage-serialized-image-details').should('contain', '35,32')

    cy.get('#vtkReadImageInputs sl-button[name="run"]').click()

    cy.get('#vtkReadImage-could-read-details').should('contain', 'true')
    cy.get('#vtkReadImage-image-details').should('contain', 'imageType')
  })

  it('Writes a VTK image', function () {
    cy.get('sl-tab[panel="vtkWriteImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['ironProt.iwi.cbor']), fileName: 'image_color.iwi.cbor' }
    cy.get('#vtkWriteImageInputs input[name="image-file"]').selectFile([testFile,], { force: true })
    cy.get('#vtkWriteImage-image-details').should('contain', 'imageType')
    cy.get('#vtkWriteImageInputs sl-input[name="serialized-image"]').find('input', { includeShadowDom: true }).type('ironProt.vtk', { force: true })

    cy.get('#vtkWriteImageInputs sl-button[name="run"]').click()

    cy.get('#vtkWriteImage-could-write-details').should('contain', 'true')
    cy.get('#vtkWriteImage-serialized-image-details').should('contain', '35,32')
  })
})
