import { demoServer } from './common.ts'

describe('structuredReportToText', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const fileName = '88.33-comprehensive-SR.dcm'
    const testFilePath = `../test/data/input/${fileName}`
    cy.readFile(testFilePath, null).as('inputData')
  })

  it('runs and produces the expected text', function () {
    cy.get('sl-tab[panel="structuredReportToText-panel"]').click()

    cy.get('#structuredReportToTextInputs input[type=file]').selectFile({ contents: new Uint8Array(this.inputData), fileName: 'inputData.dcm' }, { force: true })

    cy.get('#structuredReportToTextInputs sl-button[name="run"]').click()

    cy.get('#structuredReportToTextOutputs sl-textarea[name="output-text"]').invoke('prop', 'value').should('contain', 'Comprehensive SR Document')
    cy.get('#structuredReportToTextOutputs sl-textarea[name="output-text"]').invoke('prop', 'value').should('contain', 'Breast Imaging Report')
  })
})
