import { demoServer } from './common.ts'

describe('applyPresentationStateToImage', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    // Read the input image file
    const inputFile = 'gsps-pstate-test-input-image.dcm'
    const inputFilePath = `${testPathPrefix}${inputFile}`
    cy.readFile(inputFilePath, null).as('inputFile')
    // Read the presentation state file (that references the above image internally using its SOPInstanceUID).
    const pstateFile = 'gsps-pstate-test-input-pstate.dcm'
    const pstateFilePath = `${testPathPrefix}${pstateFile}`
    cy.readFile(pstateFilePath, null).as('pstateFile')
  })

  it('applies presentation state to a dicom image', function () {
    cy.get('sl-tab[panel="applyPresentationStateToImage-panel"]').click()

    cy.get('#applyPresentationStateToImageInputs input[name="image-in-file"]').selectFile({ contents: new Uint8Array(this.inputFile), fileName: 'inputData.dcm' }, { force: true })
    cy.get('#applyPresentationStateToImageInputs input[name="presentation-state-file-file"]').selectFile({ contents: new Uint8Array(this.pstateFile), fileName: 'pstateData.dcm' }, { force: true })

    cy.get('#applyPresentationStateToImageInputs sl-button[name="run"]').click()

    cy.get('#presentation-state-out-stream-output').should('contain', 'PresentationLabel')
  })
})
