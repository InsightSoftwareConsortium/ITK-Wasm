import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

import pytest
from pytest_pyodide import run_in_pyodide
from .fixtures import emscripten_package_wheel, package_wheel, input_data

@pytest.mark.driver_timeout(30)
@run_in_pyodide(packages=['micropip', 'numpy'])
async def test_read_write_mesh_async(selenium, emscripten_package_wheel, package_wheel, input_data):
    import micropip
    await micropip.install(emscripten_package_wheel)
    await micropip.install(package_wheel)
    def write_input_data_to_fs(input_data, filename):
        with open(filename, 'wb') as fp:
            fp.write(input_data[filename])

    from pathlib import Path

    from itkwasm import FloatTypes, IntTypes
    import numpy as np

    from itkwasm_mesh_io import read_mesh_async, write_mesh_async


    def verify_mesh(mesh):
        assert mesh.meshType.dimension == 3
        assert mesh.meshType.pointComponentType == FloatTypes.Float32
        assert mesh.meshType.pointPixelComponentType == IntTypes.UInt8
        assert mesh.numberOfPoints == 2903
        assert np.allclose(mesh.points.ravel()[0], 3.71636)
        assert np.allclose(mesh.points.ravel()[1], 2.34339)
        assert mesh.numberOfCells == 3263
        assert mesh.cellBufferSize == 18856
        assert mesh.cells[0] == 4
        assert mesh.cells[1] == 4
        assert mesh.cells[2] == 250

    test_input_file_path = 'cow.vtk'
    test_output_file_path = "read-write-cow.vtk"
    write_input_data_to_fs(input_data, test_input_file_path)

    assert Path(test_input_file_path).exists()


    mesh = await read_mesh_async(test_input_file_path)
    verify_mesh(mesh)

    use_compression = False
    await write_mesh_async(mesh, test_output_file_path, use_compression=use_compression)

    mesh = await read_mesh_async(test_output_file_path)
    verify_mesh(mesh)
