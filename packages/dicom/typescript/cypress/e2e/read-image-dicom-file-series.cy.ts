import { demoServer } from './common.ts'

describe('readImageDicomFileSeries', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/DicomImageOrientationTest/'

    for(let i = 1; i < 4; i++) {
      const inputFile = `ImageOrientation.${i}.dcm`
      const inputFilePath = `${testPathPrefix}${inputFile}`
      cy.readFile(inputFilePath, null).as(inputFile)
    }
  })

  it('reads tags from a dicom file', function () {
    cy.get('sl-tab[panel="readImageDicomFileSeries-panel"]').click()

    const inputFiles = []
    for(let i = 1; i < 4; i++) {
      inputFiles.push({ contents: new Uint8Array(this[`ImageOrientation.${i}.dcm`]), fileName: `ImageOrientation.${i}.dcm` })
    }
    cy.get('#readImageDicomFileSeriesInputs input[name="input-images-file"]').selectFile(inputFiles, { force: true })

    cy.get('#readImageDicomFileSeriesInputs sl-button[name="run"]').click()

    cy.get('#readImageDicomFileSeries-sorted-filenames-details').should('contain', 'ImageOrientation.1.dcm')
  })
})
