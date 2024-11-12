export const demoServer = "http://localhost:5181";

export function verifyTestLinearTransform(transformList) {
  cy.expect(transformList.length).to.equal(1);
  const transform = transformList[0];
  cy.expect(transform.transformType.transformParameterization).to.equal(
    "Affine"
  );
  cy.expect(transform.transformType.parametersValueType).to.equal("float64");
  cy.expect(transform.transformType.inputDimension).to.equal(3);
  cy.expect(transform.transformType.outputDimension).to.equal(3);
  cy.expect(transform.numberOfParameters).to.equal(12);
  cy.expect(transform.numberOfFixedParameters).to.equal(3);
  cy.expect(transform.fixedParameters).to.deep.equal(
    new Float64Array([0, 0, 0])
  );
  cy.expect(transform.parameters).to.deep.equal(
    new Float64Array([
      0.65631490118447, 0.5806583745824385, -0.4817536741017158,
      -0.7407986817430222, 0.37486398378429736, -0.5573995934598175,
      -0.14306664045479867, 0.7227121458012518, 0.676179776908723,
      -65.99999999999997, 69.00000000000004, 32.000000000000036,
    ])
  );
}
