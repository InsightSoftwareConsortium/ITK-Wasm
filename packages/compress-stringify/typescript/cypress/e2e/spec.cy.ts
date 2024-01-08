const demoServer = 'http://localhost:5176'

const expectedCompressedOutput = new Uint8Array([100,97,116,97,58,97,112,112,108,105,99,97,116,105,111,110,47,105,119,105,43,99,98,111,114,43,122,115,116,100,59,98,97,115,101,54,52,44,75,76,85,118,47,83,65,69,73,81,65,65,51,113,50,43,55,119,61,61])
const expectedDecompressedOutput = new Uint8Array([222,173,190,239])
const compressionOptions = { stringify: true, compressionLevel: 5, dataUrlPrefix: 'data:application/iwi+cbor+zstd;base64,' }

describe('@itk-wasm/compress-stringify', () => {
  beforeEach(function() {
    cy.visit(demoServer)
  })

  it('compressStringify runs sample inputs and produces expected outputs', () => {
    cy.get('#compressStringifyInputs sl-button[name=loadSampleInputs]').click()
    cy.get('#compressStringify-input-details').should('contain', '222,173,190,239')
    cy.get('#compressStringifyInputs sl-input[name=data-url-prefix]').should('have.value', 'data:application/iwi+cbor+zstd;base64,')

    cy.get('#compressStringifyInputs sl-button[name="run"]').click()

    cy.get('#compressStringify-output-details').should('contain', expectedCompressedOutput.toString())
  })

  it('parseStringDecompress runs sample inputs and produces expected outputs', () => {
    cy.get('sl-tab[panel="parseStringDecompress-panel"]').click()

    cy.get('#parseStringDecompressInputs sl-button[name=loadSampleInputs]').click()

    cy.get('#parseStringDecompressInputs sl-button[name="run"]').click()

    cy.get('#parseStringDecompress-output-details').should('contain', expectedDecompressedOutput)
  })

  it('compresses with the default API', function () {
    cy.window().then(async (win) => {
      const { output } = await win.compressStringify.compressStringify(expectedDecompressedOutput.slice(), compressionOptions)

      cy.expect(output).to.deep.equal(expectedCompressedOutput)
    })
  })

  it('compresses after terminating the web worker', function () {
    cy.window().then(async (win) => {
      const { output, webWorker } = await win.compressStringify.compressStringify(expectedDecompressedOutput.slice(), compressionOptions)

      cy.expect(output).to.deep.equal(expectedCompressedOutput)
      webWorker.terminate()

      const { output: outputNew } = await win.compressStringify.compressStringify(expectedDecompressedOutput.slice(), compressionOptions)
      cy.expect(outputNew).to.deep.equal(expectedCompressedOutput)
    })
  })

  it('compresses inputs twice without explicit copy', function () {
    cy.window().then(async (win) => {
      const { output, webWorker } = await win.compressStringify.compressStringify(expectedDecompressedOutput, compressionOptions)

      cy.expect(output).to.deep.equal(expectedCompressedOutput)
      webWorker.terminate()

      const { output: outputNew } = await win.compressStringify.compressStringify(expectedDecompressedOutput, compressionOptions)
      cy.expect(outputNew).to.deep.equal(expectedCompressedOutput)
    })
  })

  it('compresses with a null webWorker option', function () {
    cy.window().then(async (win) => {
      const options = { ...compressionOptions, webWorker: null }
      const { output, webWorker } = await win.compressStringify.compressStringify(expectedDecompressedOutput.slice(), options)

      cy.expect(output).to.deep.equal(expectedCompressedOutput)
      webWorker.terminate()

      const { output: outputNew } = await win.compressStringify.compressStringify(expectedDecompressedOutput.slice(), options)
      cy.expect(outputNew).to.deep.equal(expectedCompressedOutput)
    })
  })
})
