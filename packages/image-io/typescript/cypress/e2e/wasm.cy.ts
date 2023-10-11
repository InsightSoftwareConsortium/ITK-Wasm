import { demoServer } from './common.ts'

describe('wasm', () => {
  beforeEach(function() {
    cy.visit(demoServer)

    const testPathPrefix = '../test/data/input/'

    const testImageFiles = [
      'cthead1.iwi.cbor',
    ]
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName)
    })
  })

  it('Reads an ITK Wasm image', function () {
    cy.get('sl-tab[panel="wasmReadImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['cthead1.iwi.cbor']), fileName: 'cthead1.iwi.cbor' }
    cy.get('#wasmReadImageInputs input[name="serialized-image-file"]').selectFile([testFile,], { force: true })
    cy.get('#wasmReadImage-serialized-image-details').should('contain', '167,105')

    cy.get('#wasmReadImageInputs sl-button[name="run"]').click()

    cy.get('#wasmReadImage-could-read-details').should('contain', 'true')
    cy.get('#wasmReadImage-image-details').should('contain', 'imageType')
  })

  it('Writes an ITK Wasm image', function () {
    cy.get('sl-tab[panel="wasmWriteImage-panel"]').click()

    const testFile = { contents: new Uint8Array(this['cthead1.iwi.cbor']), fileName: 'cthead1.iwi.cbor' }
    cy.get('#wasmWriteImageInputs input[name="image-file"]').selectFile([testFile,], { force: true })
    cy.get('#wasmWriteImage-image-details').should('contain', 'imageType')
    cy.get('#wasmWriteImageInputs sl-input[name="serialized-image"]').find('input', { includeShadowDom: true }).type('cthead1-new.iwi.cbor', { force: true })

    cy.get('#wasmWriteImageInputs sl-button[name="run"]').click()

    cy.get('#wasmWriteImage-could-write-details').should('contain', 'true')
    cy.get('#wasmWriteImage-serialized-image-details').should('contain', '167,105')
  })
})
