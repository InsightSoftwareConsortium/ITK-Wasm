import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide
from .fixtures import package_wheel, input_data

@run_in_pyodide(packages=['micropip'])
async def test_downsample_sigma_async(selenium, package_wheel, input_data):
    import micropip
    await micropip.install([package_wheel,])

    from itkwasm_downsample_emscripten import gaussian_kernel_radius_async

    radius = await gaussian_kernel_radius_async(size=[64, 64, 32], sigma=[2.0, 4.0, 2.0])
    assert radius[0] == 5
    assert radius[1] == 10
    assert radius[2] == 5