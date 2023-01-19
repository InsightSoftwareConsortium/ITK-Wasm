const demoServer = 'http://localhost:5173'

describe('itk-compress-stringify', () => {
  it('compressStringify runs sample inputs and produces expected outputs', () => {
    cy.visit(demoServer)

    cy.get('#compressStringifyInputs sl-button[name=loadSample]').click()

    cy.get('#compressStringifyInputs form').submit()

    cy.get('#compressStringifyOutputs sl-textarea[name=output]').should('have.value', 'data:application/iwi+cbor+zstd;base64,KLUv/SAEIQAA3q2+7w==')
  })

  it('parseStringDecompress runs sample inputs and produces expected outputs', () => {
    cy.visit(demoServer)

    cy.get('#parseStringDecompressInputs sl-button[name=loadSample]').click()

    cy.get('#parseStringDecompressInputs form').submit()

    cy.get('#parseStringDecompressOutputs sl-textarea[name=output]').should('have.value', '222,173,190,239')
  })
})