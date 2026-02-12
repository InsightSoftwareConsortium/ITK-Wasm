import numpy as np

from itkwasm import Transform, TransformParameterizations, FloatTypes
from itkwasm_transform_io_wasi import mnc_read_transform, mnc_write_transform

from .common import test_output_path, verify_test_linear_transform


def _make_affine_transform():
    """Create an affine transform matching the LinearTransform test fixture."""
    return Transform(
        transformType={
            "transformParameterization": TransformParameterizations.Affine,
            "parametersValueType": FloatTypes.Float64,
            "inputDimension": 3,
            "outputDimension": 3,
        },
        numberOfFixedParameters=3,
        numberOfParameters=12,
        fixedParameters=np.array([0.0, 0.0, 0.0]),
        parameters=np.array(
            [
                0.65631490118447,
                0.5806583745824385,
                -0.4817536741017158,
                -0.7407986817430222,
                0.37486398378429736,
                -0.5573995934598175,
                -0.14306664045479867,
                0.7227121458012518,
                0.676179776908723,
                -65.99999999999997,
                69.00000000000004,
                32.000000000000036,
            ]
        ),
    )


def test_mnc_read_transform():
    """Test reading an MNC (.xfm) transform file."""
    transform = _make_affine_transform()
    transform_list = [transform]

    xfm_path = test_output_path / "mnc-read-test-LinearTransform.xfm"
    could_write = mnc_write_transform(transform_list, str(xfm_path))
    assert could_write

    could_read, transform_list_back = mnc_read_transform(xfm_path)
    assert could_read
    verify_test_linear_transform(transform_list_back)
