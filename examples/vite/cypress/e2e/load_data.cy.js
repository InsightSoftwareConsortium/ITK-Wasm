describe('Load data', () => {
  it('successfully loads a mesh', () => {
    cy.visit('http://localhost:8085/')
    cy.fixture('cow.vtk', null).then((cowBuffer) => {
      cy.get('input[type=file]').selectFile({ contents: cowBuffer, fileName: 'cow.vtk' })
      cy.get('textarea').contains('"numberOfPoints": 2903,')
    })
  })

  it('successfully loads an image', () => {
    cy.visit('http://localhost:8085/')
    cy.fixture('cthead1.png', null).then((headBuffer) => {
      cy.get('input[type=file]').selectFile({ contents: headBuffer, fileName: 'cthead1.png' })
      cy.get('textarea').contains('"imageType"')
    })
  })
})
