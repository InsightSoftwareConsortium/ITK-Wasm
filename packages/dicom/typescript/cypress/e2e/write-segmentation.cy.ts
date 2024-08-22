import { demoServer } from './common.ts'

describe('writeSegmentation', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/dicom-images/'

    // Read the input file
    const inputFile = 'SEG/ReMIND-001/tumor_seg_MR_ref_3DSAGT2SPACE.nrrd'
    const inputFilePath = `${testPathPrefix}${inputFile}`
    cy.readFile(inputFilePath, null).as('inputFile')

    const metaInfoFile = 'SEG/MR_ref_3DSAGT2SPACE_tumor_seg.json'
    const metaInfoFilePath = `../test/data/baseline/dicom-images/${metaInfoFile}`
    cy.readFile(metaInfoFilePath, null).as('metaInfoFile')//.should('not.equal', null)

    const refFiles = [
      "SEG/ReMIND-001/3DSAGT2SPACE/1-001.dcm",
      "SEG/ReMIND-001/3DSAGT2SPACE/1-002.dcm",
      "SEG/ReMIND-001/3DSAGT2SPACE/1-003.dcm",
    ]
    cy.readFile(`${testPathPrefix}${refFiles[0]}`, null).as('ref0.dcm')
    cy.readFile(`${testPathPrefix}${refFiles[1]}`, null).as('ref1.dcm')
    cy.readFile(`${testPathPrefix}${refFiles[2]}`, null).as('ref2.dcm')
  })

  it('writes a segmentation image to a dicom file', function () {
    cy.get('sl-tab[panel="writeSegmentation-panel"]').click()

    cy.get('#writeSegmentationInputs input[name=seg-image-file]').selectFile({ contents: new Uint8Array(this.inputFile), fileName: 'inputData.nrrd' }, { force: true })
    cy.get('#writeSegmentationInputs input[name=meta-info-file]').selectFile({ contents: new Uint8Array(this.metaInfoFile), fileName: 'inputData.json' }, { force: true })

    cy.get('#writeSegmentationInputs sl-input[name=output-dicom-file]').find('input', { includeShadowDom: true }).type('output_write_segmentation.dcm', { force: true }) 
    //cy.get('#niftiWriteImageInputs sl-input[name="serialized-image"]').find('input', { includeShadowDom: true }).type('r16slice.nii.gz', { force: true })
    //cy.get('#writeSegmentationInputs input[name="output-dicom-file"]').type('output_tumor_seg_MR_ref_3DSAGT2SPACE.dcm')

    const inputFiles = []
    for(let i = 0; i < 3; i++) {
      inputFiles.push({ contents: new Uint8Array(this[`ref${i}.dcm`]), fileName: `ref${i}.dcm` })
    }
    cy.get('#writeSegmentationInputs input[name="ref-dicom-series-file"]').selectFile( inputFiles, { force: true })

    // need to click twice for some reason `\/O\/`
    cy.get('#writeSegmentationInputs sl-button[name="run"]').click()
    cy.get('#writeSegmentationInputs sl-button[name="run"]').click()

    cy.get('#writeSegmentation-seg-image-details').should('exist')
    cy.get('#writeSegmentation-output-dicom-file-details').should('exist')
    // cy.get('#writeSegmentation-output-dicom-file-details').should('contain', '0,0,0,0,0,0,0,0,0,0,0,')
    //cy.get('#writeSegmentation-meta-info-details').should('contain', '"labelID": 1')
    //cy.get('#writeSegmentation-meta-info-details').should('contain', '"BodyPartExamined": "BRAIN"')
  })
})
