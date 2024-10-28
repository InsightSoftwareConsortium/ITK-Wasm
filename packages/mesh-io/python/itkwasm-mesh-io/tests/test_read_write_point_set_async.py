import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

import pytest
from pytest_pyodide import run_in_pyodide
from .fixtures import emscripten_package_wheel, package_wheel, input_data

@pytest.mark.driver_timeout(30)
@run_in_pyodide(packages=['micropip', 'numpy'])
async def test_read_write_point_set_async(selenium, emscripten_package_wheel, package_wheel, input_data):
    import micropip
    await micropip.install(emscripten_package_wheel)
    await micropip.install(package_wheel)
    def write_input_data_to_fs(input_data, filename):
        with open(filename, 'wb') as fp:
            fp.write(input_data[filename])

    from pathlib import Path

    from itkwasm import FloatTypes, IntTypes
    import numpy as np

    from itkwasm_mesh_io import read_point_set_async, write_point_set_async


    def verify_point_set(point_set):
        assert point_set.pointSetType.dimension == 3
        assert point_set.pointSetType.pointComponentType == FloatTypes.Float32
        assert point_set.pointSetType.pointPixelComponentType == FloatTypes.Float32
        assert point_set.numberOfPoints == 8

    test_input_file_path = 'box-points.obj'
    test_output_file_path = "read-write-box-points-python.obj"
    write_input_data_to_fs(input_data, test_input_file_path)

    assert Path(test_input_file_path).exists()


    point_set = await read_point_set_async(test_input_file_path)
    verify_point_set(point_set)

    use_compression = False
    await write_point_set_async(point_set, test_output_file_path, use_compression=use_compression)

    point_set = await read_point_set_async(test_output_file_path)
    verify_point_set(point_set)
