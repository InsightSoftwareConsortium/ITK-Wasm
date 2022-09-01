describe('structuredReportToText', () => {
  beforeEach(function() {
    cy.visit('/')

    const fileName = '88.33-comprehensive-SR.dcm'
    const testFilePath = `../../build-emscripten/ExternalData/test/Input/${fileName}`
    cy.readFile(testFilePath, null).as('inputData')
  })

  it('runs and produces the expected text', function() {
    cy.get('input[type=file]').selectFile({ contents: new Uint8Array(this.inputData), fileName: 'inputData.dcm' })
    cy.get('textarea').contains('Comprehensive SR Document')
  })
})
