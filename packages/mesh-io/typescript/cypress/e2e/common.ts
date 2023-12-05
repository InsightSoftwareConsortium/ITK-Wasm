export const demoServer = 'http://localhost:5178'

import { IntTypes, FloatTypes, PixelTypes } from 'itk-wasm'

export function verifyMesh (mesh) {
  cy.expect(mesh.meshType.dimension).to.equal(3)
  cy.expect(mesh.meshType.pointComponentType).to.equal(FloatTypes.Float32)
  cy.expect(mesh.meshType.cellComponentType).to.equal(IntTypes.UInt32)
  cy.expect(mesh.meshType.pointPixelType).to.equal(PixelTypes.Scalar)
  cy.expect(mesh.meshType.cellPixelType).to.equal(PixelTypes.Scalar)
  cy.expect(mesh.numberOfPoints).to.equal(2903)
  cy.expect(mesh.numberOfCells).to.equal(3263)
}
