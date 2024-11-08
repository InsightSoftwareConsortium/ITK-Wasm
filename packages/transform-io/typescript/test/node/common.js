import path from "path";
import fs from "fs";

export const testInputPath = path.resolve("..", "test", "data", "input");
export const testBaselinePath = path.resolve("..", "test", "data", "baseline");
export const testOutputPath = path.resolve(
  "..",
  "test",
  "output",
  "typescript"
);
fs.mkdirSync(testOutputPath, { recursive: true });

export function verifyTestLinearTransform(t, transformList) {
  t.is(transformList.length, 1);
  const transform = transformList[0];
  t.is(transform.transformType.transformParameterization, "Affine");
  t.is(transform.transformType.parametersValueType, "float64");
  t.is(transform.transformType.inputDimension, 3);
  t.is(transform.transformType.outputDimension, 3);
  t.is(transform.numberOfParameters, 12);
  t.is(transform.numberOfFixedParameters, 3);
  t.deepEqual(transform.fixedParameters, new Float64Array([0, 0, 0]));
  t.deepEqual(
    transform.parameters,
    new Float64Array([
      0.65631490118447, 0.5806583745824385, -0.4817536741017158,
      -0.7407986817430222, 0.37486398378429736, -0.5573995934598175,
      -0.14306664045479867, 0.7227121458012518, 0.676179776908723,
      -65.99999999999997, 69.00000000000004, 32.000000000000036,
    ])
  );
}
