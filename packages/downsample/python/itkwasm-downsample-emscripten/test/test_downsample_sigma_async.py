import sys

if sys.version_info < (3,10):
    pytest.skip("Skipping pyodide tests on older Python", allow_module_level=True)

from pytest_pyodide import run_in_pyodide
from .fixtures import package_wheel, input_data

@run_in_pyodide(packages=['micropip'])
async def test_downsample_sigma_async(selenium, package_wheel, input_data):
    import micropip
    await micropip.install([package_wheel,])

    from itkwasm_downsample_emscripten import downsample_sigma_async

    sigma = await downsample_sigma_async(shrink_factors=[2, 4])
    assert sigma[0] == 0.735534255037358
    assert sigma[1] == 1.6447045940431997