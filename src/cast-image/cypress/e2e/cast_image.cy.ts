describe('structuredReportToText', () => {
  beforeEach(function() {
    cy.visit('/')

    const fileName = '88.33-comprehensive-SR.dcm'
    const testFilePath = `../../build-emscripten/ExternalData/test/Input/${fileName}`
    cy.readFile(testFilePath, null).as('inputData')
  })

  it('runs and produces the expected text', function() {
    cy.get('input[type=file]').selectFile({ contents: new Uint8Array(this.inputData), fileName: 'inputData.dcm' }, { force: true })
    cy.get('sp-textarea').should('include.text', 'Comprehensive SR Document')
  })

  it('does not contain the document header when option checked', function() {
    cy.get('#noDocumentHeader').click()
    cy.get('input[type=file]').selectFile({ contents: new Uint8Array(this.inputData), fileName: 'inputData.dcm' }, { force: true })
    cy.get('sp-textarea').should('include.text', 'Breast Imaging Report')
    cy.get('sp-textarea').should('not.include.text', 'Comprehensive SR Document')
  })
})
