import { demoServer } from './common.ts'

describe('readDicomEncapsulatedPdf', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    // Read the input file
    const inputFile = '104.1-SR-printed-to-pdf.dcm'
    const inputFilePath = `${testPathPrefix}${inputFile}`
    cy.readFile(inputFilePath, null).as('inputFile')
  })

  it('reads a pdf from a dicom file', function () {
    cy.get('sl-tab[panel="readDicomEncapsulatedPdf-panel"]').click()

    cy.get('#readDicomEncapsulatedPdfInputs input[name="dicom-file-file"]').selectFile({ contents: new Uint8Array(this.inputFile), fileName: 'inputData.dcm' }, { force: true })

    cy.get('#readDicomEncapsulatedPdfInputs sl-button[name="run"]').click()

    cy.get('#pdf-binary-output-details object[type="application/pdf"]').should('exist')
  })
})
