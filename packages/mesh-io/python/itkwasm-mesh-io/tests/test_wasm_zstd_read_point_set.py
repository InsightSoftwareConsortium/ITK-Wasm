import pytest
import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide

from .fixtures import emscripten_package_wheel, package_wheel, input_data

@run_in_pyodide(packages=['micropip'])
async def test_wasm_zstd_read_point_set(selenium, package_wheel, emscripten_package_wheel):
    import micropip
    await micropip.install(emscripten_package_wheel)
    await micropip.install(package_wheel)

    from itkwasm_mesh_io import wasm_zstd_read_point_set

    # Write your test code here
