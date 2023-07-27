const demoServer = 'http://localhost:5173'

describe('@itk-wasm/compress-stringify', () => {
  it('compressStringify runs sample inputs and produces expected outputs', () => {
    cy.visit(demoServer)

    cy.get('#compressStringifyInputs sl-button[name=loadSampleInputs]').click()
    cy.get('#compressStringifyInputs sl-input[name=input]').should('have.value', '222,173,190,239')
    cy.get('#compressStringifyInputs sl-input[name=data-url-prefix]').should('have.value', 'data:application/iwi+cbor+zstd;base64,')

    cy.get('#compressStringifyInputs sl-button[name="run"]').click()

    cy.get('#compressStringifyOutputs sl-textarea[name=output]').should('have.value', '100,97,116,97,58,97,112,112,108,105,99,97,116,105,111,110,47,105,119,105,43,99,98,111,114,43,122,115,116,100,59,98,97,115,101,54,52,44,75,76,85,118,47,83,65,69,73,81,65,65,51,113,50,43,55,119,61,61 ...')
  })

  it('parseStringDecompress runs sample inputs and produces expected outputs', () => {
    cy.visit(demoServer)

    cy.get('sl-tab[panel="parseStringDecompress-panel"]').click()

    cy.get('#parseStringDecompressInputs sl-button[name=loadSampleInputs]').click()

    cy.get('#parseStringDecompressInputs sl-button[name="run"]').click()

    cy.get('#parseStringDecompressOutputs sl-textarea[name=output]').should('have.value', '222,173,190,239 ...')
  })
})