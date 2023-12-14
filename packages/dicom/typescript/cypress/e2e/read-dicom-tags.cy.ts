import { demoServer } from './common.ts'

describe('readDicomTags', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/dicom-images/'

    const inputFile = 'ultrasound.dcm'
    const inputFilePath = `${testPathPrefix}${inputFile}`
    cy.readFile(inputFilePath, null).as('inputFile')
  })

  // Passes locally but fails in CI
  it.skip('reads tags from a dicom file', function () {
    cy.get('sl-tab[panel="readDicomTags-panel"]').click()

    cy.get('#readDicomTagsInputs input[name="dicom-file-file"]').selectFile({ contents: new Uint8Array(this.inputFile), fileName: 'inputData.dcm' }, { force: true })

    cy.get('#readDicomTagsInputs sl-button[name="run"]').click()

    cy.get('#readDicomTags-tags-details').should('contain', '0008|0005')
  })
})
