describe('Wasm Hello World', () => {
  it('successfully runs', () => {
    cy.visit('/')
    cy.get('textarea').contains('Hello Wasm world!')
  })
})
