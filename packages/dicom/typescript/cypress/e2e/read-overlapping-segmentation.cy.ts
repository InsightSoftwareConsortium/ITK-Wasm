import { demoServer } from './common.ts'

describe('readOverlappingSegmentation', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/output/'

    // Read the input file
    const inputFile = 'liver_heart_seg.dcm'
    const inputFilePath = `${testPathPrefix}${inputFile}`
    cy.readFile(inputFilePath, null).as('inputFile')
  })

  it('reads segmentation from a dicom file', function () {
    cy.get('sl-tab[panel="readOverlappingSegmentation-panel"]').click()

    cy.get('#readOverlappingSegmentationInputs input[name="dicom-file-file"]').selectFile({ contents: new Uint8Array(this.inputFile), fileName: 'inputData.dcm' }, { force: true })

    cy.get('#readOverlappingSegmentationInputs sl-button[name="run"]').click()

    cy.get('#readOverlappingSegmentation-seg-image-details').should('exist')
    //cy.get('#readOverlappingSegmentation-seg-image-details').should('contain', '"pixelType": "VariableLengthVector"')

    cy.get('#readOverlappingSegmentation-meta-info-details').should('contain', '"SegmentLabel": "Liver"')
    cy.get('#readOverlappingSegmentation-meta-info-details').should('contain', '"labelID": 1')
    cy.get('#readOverlappingSegmentation-meta-info-details').should('contain', '"SegmentLabel": "Thoracic spine"')
    cy.get('#readOverlappingSegmentation-meta-info-details').should('contain', '"labelID": 2')
    cy.get('#readOverlappingSegmentation-meta-info-details').should('contain', '"SegmentLabel": "Heart"')
    cy.get('#readOverlappingSegmentation-meta-info-details').should('contain', '"labelID": 3')
  })
})
