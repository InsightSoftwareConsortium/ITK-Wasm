import { demoServer } from './common.ts'

describe('readSegmentation', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/dicom-images/'

    // Read the input file
    const inputFile = 'SEG/ReMIND-001/tumor_seg_MR_ref_3DSAGT2SPACE/1-1.dcm'
    const inputFilePath = `${testPathPrefix}${inputFile}`
    cy.readFile(inputFilePath, null).as('inputFile')
  })

  it('reads segmentation from a dicom file', function () {
    cy.get('sl-tab[panel="readSegmentation-panel"]').click()

    cy.get('#readSegmentationInputs input[name="dicom-file-file"]').selectFile({ contents: new Uint8Array(this.inputFile), fileName: 'inputData.dcm' }, { force: true })

    cy.get('#readSegmentationInputs sl-button[name="run"]').click()

    cy.get('#readSegmentation-seg-image-details').should('exist')

    cy.get('#readSegmentation-meta-info-details').should('contain', '"labelID": 1')
    cy.get('#readSegmentation-meta-info-details').should('contain', '"BodyPartExamined": "BRAIN"')
  })
})
