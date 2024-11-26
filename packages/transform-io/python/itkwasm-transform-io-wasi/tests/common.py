from pathlib import Path
import numpy as np

from itkwasm import TransformList, TransformParameterizations, FloatTypes

test_input_path = Path(__file__).parent / ".." / ".." / ".." / "test" / "data" / "input"
test_baseline_path = Path(__file__).parent / ".." / ".." / ".." / "test" / "data" / "baseline"
test_output_path = Path(__file__).parent / ".." / ".." / ".." / "test" / "data" / "output" / "python-wasi"
test_output_path.mkdir(parents=True, exist_ok=True)

def verify_test_linear_transform(transform_list: TransformList):
    assert len(transform_list) == 1
    transform = transform_list[0]
    assert transform.transformType.transformParameterization == TransformParameterizations.Affine
    assert transform.transformType.parametersValueType == FloatTypes.Float64
    assert transform.numberOfParameters == 12
    assert transform.numberOfFixedParameters == 3
    np.testing.assert_allclose(transform.fixedParameters, np.array([0.0, 0.0, 0.0]))
    np.testing.assert_allclose(transform.parameters, np.array([
      0.65631490118447, 0.5806583745824385, -0.4817536741017158,
      -0.7407986817430222, 0.37486398378429736, -0.5573995934598175,
      -0.14306664045479867, 0.7227121458012518, 0.676179776908723,
      -65.99999999999997, 69.00000000000004, 32.000000000000036]))
