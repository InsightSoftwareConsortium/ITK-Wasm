describe('WASM Hello World', () => {
  it('successfully runs', () => {
    cy.visit('/')
    cy.get('textarea').contains('Hello WASM world!')
  })
})
