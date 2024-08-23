import { demoServer } from './common.ts'

describe('writeMultiSegmentation', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const dcmqi_lib_SOURCE_DIR = '../emscripten-build/_deps/dcmqi_lib-src/'

    // Read the input file
    const segImages = [
      'data/segmentations/partial_overlaps-1.nrrd',
      'data/segmentations/partial_overlaps-2.nrrd',
      'data/segmentations/partial_overlaps-3.nrrd',
    ]
    cy.readFile(`${dcmqi_lib_SOURCE_DIR}${segImages[0]}`, null).as('input0.nrrd')
    cy.readFile(`${dcmqi_lib_SOURCE_DIR}${segImages[1]}`, null).as('input1.nrrd')
    cy.readFile(`${dcmqi_lib_SOURCE_DIR}${segImages[2]}`, null).as('input2.nrrd')

    /*
    const inputFile = 'SEG/overlapping/overlapping-seg.nrrd'
    const inputFilePath = `${dcmqi_lib_SOURCE_DIR}${inputFile}`
    cy.readFile(inputFilePath, null).as('inputFile')
    */

    const metaInfoFile = 'doc/examples/seg-example_partial_overlaps.json'
    const metaInfoFilePath = `${dcmqi_lib_SOURCE_DIR}${metaInfoFile}`
    cy.readFile(metaInfoFilePath, null).as('metaInfoFile')//.should('not.equal', null)

    const refFiles = [
      'data/segmentations/ct-3slice/01.dcm',
      'data/segmentations/ct-3slice/02.dcm',
      'data/segmentations/ct-3slice/03.dcm',
    ]
    cy.readFile(`${dcmqi_lib_SOURCE_DIR}${refFiles[0]}`, null).as('ref0.dcm')
    cy.readFile(`${dcmqi_lib_SOURCE_DIR}${refFiles[1]}`, null).as('ref1.dcm')
    cy.readFile(`${dcmqi_lib_SOURCE_DIR}${refFiles[2]}`, null).as('ref2.dcm')
  })

  it('writes a segmentation image to a dicom file', function () {
    cy.get('sl-tab[panel="writeMultiSegmentation-panel"]').click()

    const inputFiles = []
    for(let i = 0; i < 3; i++) {
      inputFiles.push({ contents: new Uint8Array(this[`input${i}.nrrd`]), fileName: `input${i}.nrrd` })
    }
    cy.get('#writeMultiSegmentationInputs input[name="seg-images-file"]').selectFile( inputFiles, { force: true })
    cy.get('#writeMultiSegmentationInputs input[name=meta-info-file]').selectFile({ contents: new Uint8Array(this.metaInfoFile), fileName: 'input-metainfo.json' }, { force: true })
    cy.get('#writeMultiSegmentationInputs sl-input[name=output-dicom-file]').find('input', { includeShadowDom: true }).type('output-write-segmentation.dcm', { force: true }) 

    const refFiles = []
    for(let i = 0; i < 3; i++) {
      refFiles.push({ contents: new Uint8Array(this[`ref${i}.dcm`]), fileName: `ref${i}.dcm` })
    }
    cy.get('#writeMultiSegmentationInputs input[name="ref-dicom-series-file"]').selectFile( refFiles, { force: true })

    //cy.get('#writeMultiSegmentationInputs sl-button[name="run"]').should('be.enabled')
    cy.get('#writeMultiSegmentationInputs sl-button[name=run]').find('button', { includeShadowDom: true }).should('be.enabled')
    cy.get('#writeMultiSegmentationInputs sl-button[name="run"]').click()

    //cy.get('#writeMultiSegmentation-seg-images-details').should('exist')
    cy.get('#writeMultiSegmentation-output-dicom-file-details').should('exist')
    cy.get('#writeMultiSegmentation-output-dicom-file-details').should('contain', '0,0,0,0,0,0,0,0,0,0,0,')
  })
})
