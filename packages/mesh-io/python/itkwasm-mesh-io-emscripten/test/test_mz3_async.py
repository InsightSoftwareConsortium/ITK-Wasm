import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide
from .fixtures import package_wheel, input_data

@run_in_pyodide(packages=['micropip', 'numpy'])
async def test_mz3_async(selenium, package_wheel, input_data):
    import micropip
    await micropip.install(package_wheel)
    def write_input_data_to_fs(input_data, filename):
        with open(filename, 'wb') as fp:
            fp.write(input_data[filename])

    from pathlib import Path
    from itkwasm import FloatTypes, PixelTypes, IntTypes
    import numpy as np

    from itkwasm_mesh_io_emscripten import mz3_read_mesh_async, mz3_write_mesh_async

    def verify_mesh(mesh):
        assert mesh.meshType.dimension == 3
        assert mesh.meshType.pointComponentType == FloatTypes.Float32
        assert mesh.meshType.cellComponentType == IntTypes.UInt32
        assert mesh.meshType.pointPixelType == PixelTypes.Scalar
        assert mesh.meshType.cellPixelType == PixelTypes.Scalar
        assert mesh.numberOfPoints == 6
        assert mesh.numberOfCells == 8

    test_file_path = '11ScalarMesh.mz3'
    write_input_data_to_fs(input_data, test_file_path)

    assert Path(test_file_path).exists()

    could_read, mesh = await mz3_read_mesh_async(test_file_path)
    assert could_read
    verify_mesh(mesh)

    test_output_file_path = '11ScalarMesh_out.mz3'

    use_compression = False
    could_write = await mz3_write_mesh_async(mesh, test_output_file_path, use_compression)
    assert could_write

    could_read, mesh = await mz3_read_mesh_async(test_output_file_path)
    assert could_read
    verify_mesh(mesh)
