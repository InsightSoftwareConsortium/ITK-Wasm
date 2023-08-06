import { demoServer } from './common.ts'

describe('structuredReportToHtml', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const fileName = '88.33-comprehensive-SR.dcm'
    const testFilePath = `../test/data/input/${fileName}`
    cy.readFile(testFilePath, null).as('inputData')
  })

  it('runs and produces the expected text', function () {
    cy.get('sl-tab[panel="structuredReportToHtml-panel"]').click()

    cy.get('#structuredReportToHtmlInputs input[name=dicom-file-file]').selectFile({ contents: new Uint8Array(this.inputData), fileName: 'inputData.dcm' }, { force: true })

    cy.get('#structuredReportToHtmlInputs sl-button[name="run"]').click()

    cy.get('#html-output-details iframe').should('exist')
  })
})
