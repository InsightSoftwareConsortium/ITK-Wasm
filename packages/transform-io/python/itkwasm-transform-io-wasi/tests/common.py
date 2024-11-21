from pathlib import Path
import numpy as np

from itkwasm import TransformList, TransformParameterizations, FloatTypes

test_input_path = Path(__file__).parent / ".." / ".." / ".." / "test" / "data" / "input"
test_baseline_path = Path(__file__).parent / ".." / ".." / ".." / "test" / "data" / "baseline"
test_output_path = Path(__file__).parent / ".." / ".." / ".." / "test" / "data" / "output" / "python"
test_output_path.mkdir(parents=True, exist_ok=True)

def verify_test_linear_transform(transform_list: TransformList):
    assert len(transform_list.transforms) == 1
    transform = transform_list.transforms[0]
    assert transform.name == "Transform"
    assert transform.transformType.transformParameterization == TransformParameterizations.Affine
    assert transform.transformType.parametersValueType == FloatTypes.Float64
    assert transform.transformType.fixedParametersValueType == FloatTypes.Float64
    assert transform.numberOfParameters == 12
    assert transform.numberOfFixedParameters == 3
    assert np.testing.array_almost_equals(transform.fixedParameters, [0.0, 0.0, 0.0])
    assert np.testing.array_almost_equals(transform.parameters, [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0])