import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

import pytest
from pytest_pyodide import run_in_pyodide
from .fixtures import package_wheel, input_data, emscripten_package_wheel

@pytest.mark.driver_timeout(30)
@run_in_pyodide(packages=['micropip', 'numpy'])
async def test_read_write_mesh_async(selenium, package_wheel, emscripten_package_wheel, input_data):
    import micropip
    await micropip.install(emscripten_package_wheel)
    await micropip.install(package_wheel)
    def write_input_data_to_fs(input_data, filename):
        with open(filename, 'wb') as fp:
            fp.write(input_data[filename])

    from pathlib import Path

    from itkwasm import TransformParameterizations, FloatTypes
    import numpy as np

    from itkwasm_transform_io import read_transform_async, write_transform_async

    def write_input_data_to_fs(input_data, filename):
        with open(filename, 'wb') as fp:
            fp.write(input_data[filename])

    def verify_test_linear_transform(transform_list):
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

    test_file_path = 'LinearTransform.h5'
    write_input_data_to_fs(input_data, test_file_path)

    assert Path(test_file_path).exists()

    transform = await read_transform_async(test_file_path)
    verify_test_linear_transform(transform)

    test_output_file_path = 'out-LinearTransform.h5'

    use_compression = False
    await write_transform_async(transform, test_output_file_path, use_compression)

    transform = await read_transform_async(test_output_file_path)
    verify_test_linear_transform(transform)
